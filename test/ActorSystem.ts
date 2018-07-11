import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"

class Entity {
  constructor(public message: string) { }
}

class Entity1 {
  constructor(public message: string) { }
}

test("emit all", t => {
  t.plan(2)
  const system = new ActorSystem("testSystem")

  class A1 extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder()
        .match(Entity, entity => t.is(entity.message, "1"))
        .build()
    }
  }

  class A2 extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder()
        .match(Entity, entity => t.is(entity.message, "1"))
        .build()
    }
  }

  system.actorOf(new A1)
  system.actorOf(new A2)

  system.eventStream.emit("**", new Entity("1"))
})

test("broadcast to all hierarchy", t => {
  t.plan(3)
  class Self extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder().matchAny(obj =>
        t.is(obj.n, 1)
      ).build()
    }
  }

  class Child extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder().matchAny(obj => {
        t.is(obj.n, 1)
      }).build()
    }
  }

  class Grandchild extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder().matchAny(obj => {
        t.is(obj.n, 1)
      }).build()
    }
  }

  const system = new ActorSystem("testSystem")
  const selfActor = system.actorOf(new Self, "self")
  const childActor = selfActor.getActor().context.actorOf(new Child, "child")
  const grandchild = childActor.getActor().context.actorOf(new Grandchild, "grandchild")

  // broadcast message to level 2. root: 0, self: 1, child: 2
  system.broadcast({ n: 1 })
})

test("broadcast to a special hierarchy", t => {
  t.plan(2)
  class Self extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder().matchAny(obj =>
        t.is(obj.n, 1)
      ).build()
    }
  }

  class Child extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder().matchAny(obj => {
        t.is(obj.n, 1)
        t.pass()
      }).build()
    }
  }

  class Grandchild extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder().matchAny(obj => {
        t.is(obj.n, 1)
      }).build()
    }
  }

  const system = new ActorSystem("testSystem")
  const selfActor = system.actorOf(new Self, "self")
  const childActor = selfActor.getActor().context.actorOf(new Child, "child")
  const grandchild = childActor.getActor().context.actorOf(new Grandchild, "grandchild")

  // broadcast message to level 2(child). root: 0, self: 1, child: 2
  system.broadcast({ n: 1 }, 2)
})