import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"
import { Serializer } from "../src";

class Entity {
  constructor(public message: string) { }
}

class Entity1 {
  constructor(public message: string) { }
}

class TestActor extends AbstractActor {
  createReceive() {
    return this.receiveBuilder().build()
  }
}

test("no listen", t => {
  const system = new ActorSystem("testSystem")

  const testActor = system.actorOf(new TestActor)

  t.is(system.eventStream.eventNames().length, 0)
})

test("onAny", t => {
  t.plan(2)
  const system = new ActorSystem("testSystem")

  class Test extends AbstractActor {
    preStart() {
      this.context.system.eventStream.onAny((event, obj) => {
        t.is(obj.n, 1)
      })
    }
    createReceive() {
      return this.receiveBuilder().build()
    }
  }

  system.actorOf(new Test)
  system.broadcast({ n: 1 })
  system.broadcast({ n: 1 })
})

test("broadcast to all", t => {
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
  const childActor = selfActor.getInstance().context.actorOf(new Child, "child")
  const grandchild = childActor.getInstance().context.actorOf(new Grandchild, "grandchild")

  system.broadcast({ n: 1 })
})

test("broadcast to", t => {
  t.plan(3)
  class Self extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder().matchAny(obj => {
        t.is(obj.n, 1)
      }).build()
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
  const childActor = selfActor.getInstance().context.actorOf(new Child, "child")
  const childActor1 = selfActor.getInstance().context.actorOf(new Child, "child1")
  const grandchild = childActor.getInstance().context.actorOf(new Grandchild, "grandchild")

  system.broadcast({ n: 1 }, "root/self/")
})

test("broadcast to with volume", t => {
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
  const childActor = selfActor.getInstance().context.actorOf(new Child, "child")
  const childActor1 = selfActor.getInstance().context.actorOf(new Child, "child1")
  const grandchild = childActor.getInstance().context.actorOf(new Grandchild, "grandchild")

  system.broadcast({ n: 1 }, "root/self/", 1)
})


test("logging every message passthrough system", t => {
  t.plan(1)
  const system = new ActorSystem("testSystem")
  class LoggerActor extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder()
        .build()
    }

    public preStart() {
      this.context.system.eventStream.on("**", async function ({ n }) {
        t.is(n, 1)
      })
    }

    public postStop() {
      // stop listener
    }
  }

  const logger = system.actorOf(new LoggerActor, "logger")
  system.tell("anyMessage", { n: 1 })
})

test("logging self message", t => {
  t.plan(1)
  const system = new ActorSystem("testSystem")
  class LoggerActor extends AbstractActor {
    public createReceive() {
      return this.receiveBuilder()
        .build()
    }

    public preStart() {
      this.context.system.eventStream.on(this.context.path, function ({ n }) {
        t.is(n, 2)
      })
    }

    public postStop() {
      // stop listener
    }
  }

  const logger = system.actorOf(new LoggerActor, "logger")
  system.tell("root/anyMessage", { n: 1 })
  system.tell("root/logger", { n: 2 })
})

test("serialize message", t => {
  t.plan(3)
  const system = ActorSystem.create("test serializer", true)
  class Test extends AbstractActor {
    preStart() {
      this.context.system.eventStream.onAny(function (_, message) {
        t.is(message.type, "Entity")
        t.notDeepEqual(message.paylod, { message: "hello" })
      })
    }
    createReceive() {
      return this.receiveBuilder().match(Entity, entity => t.is(entity.message, "hello")).build()
    }
  }
  system.actorOf(new Test)
  system.broadcast(new Entity("hello"))
})
