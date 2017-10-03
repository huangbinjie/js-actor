import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"
import { ReceiveBuilder } from "../src/ReceiveBuilder"

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
	const system = new ActorSystem("testSystem")
	t.is(system.eventStream.eventNames().length, 0)
})


test("stop child should remove all child of the child's listener", t => {
	const system = new ActorSystem("testSystem")
	const selfActor = system.actorOf(new Self, "self")
	const childActor = selfActor.getContext().actorOf(new Child, "child")
	const grandchild = childActor.getContext().actorOf(new Grandchild, "grandchild")
	system.stop(selfActor)
	t.is(system.eventStream.eventNames().length, 0)
	t.is((system as any).rootActorRef.getContext().children.size, 0)
})

test("find grandchild", t => {
	const system = new ActorSystem("testSystem")
	const selfActor = system.actorOf(new Self, "self")
	const childActor = selfActor.getContext().actorOf(new Child, "child")
	const grandchild = childActor.getContext().actorOf(new Grandchild, "grandchild")

	const grandChildActor = selfActor.getContext().child("grandchild")!
	t.truthy(grandChildActor)
	const grandChildContext = grandChildActor.getContext()
	t.is(grandChildContext.path, "/self/child/grandchild/")
	t.is(grandChildContext.name, "grandchild")
})

test("become", t => {
	const system = new ActorSystem("testSystem")
	const selfActor = system.actorOf(new Self)

	const behavior = ReceiveBuilder.create().matchAny(({ n }) => t.is(1, n)).build()

	selfActor.getContext().become(behavior)

	selfActor.tell({ n: 1 })

	// eventemitter2's bug, eventNames() does not work with wildcard
	// t.is(system.eventStream.eventNames().length, 1)

	selfActor.getContext().stop()

})