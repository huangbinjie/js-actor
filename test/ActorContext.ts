import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"

const system = new ActorSystem("testSystem")

class Self extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder().build()
	}
}

class Child extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder().build()
	}
}

class Grandchild extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder().build()
	}
}

test("root actor should not listen", t => {
	t.is(system.eventStream.eventNames().length, 0)
})


test("stop child should remove all child of the child's listener", t => {
	const selfActor = system.actorOf(new Self, "self")
	const childActor = selfActor.getContext().actorOf(new Child, "child")
	const grandchild = childActor.getContext().actorOf(new Grandchild, "grandchild")
	system.stop(selfActor)
	t.is(system.eventStream.eventNames().length, 0)
	t.is((system as any).rootActorRef.getContext().children.size, 0)
})

test("find grandchild", t => {
	const selfActor = system.actorOf(new Self, "self")
	const childActor = selfActor.getContext().actorOf(new Child, "child")
	const grandchild = childActor.getContext().actorOf(new Grandchild, "grandchild")

	const grandChildActor = selfActor.getContext().child("grandchild")
	t.truthy(grandChildActor)
	const grandChildContext = grandChildActor.getContext()
	t.is(grandChildContext.path, "/self/child/grandchild/")
	t.is(grandChildContext.name, "grandchild")
})