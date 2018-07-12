import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"
import { ActorReceiveBuilder } from "../src/ActorReceiveBuilder"

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
	const childActor = selfActor.getActor().context.actorOf(new Child, "child")
	const grandchild = childActor.getActor().context.actorOf(new Grandchild, "grandchild")
	system.stop(selfActor)
	t.is(system.eventStream.eventNames().length, 0)
	t.is(system.getRoot().getActor().context.children.size, 0)
})

test("child", t => {
	const system = new ActorSystem("testSystem")
	const selfActor = system.actorOf(new Self, "self")
	const childActor = selfActor.getActor().context.actorOf(new Child, "child")
	const grandchildActor = childActor.getActor().context.actorOf(new Grandchild, "grandchild")

	const child = selfActor.getActor().context.child("child")
	const grandChild = selfActor.getActor().context.child("grandchild")
	t.truthy(child)
	t.is(grandChild, undefined)
	const childContext = child!.getActor().context
	t.is(childContext.path, "root/self/child")
	t.is(childContext.name, "child")
})

test("become", t => {
	const system = new ActorSystem("testSystem")
	const selfActor = system.actorOf(new Self)

	const behavior = ActorReceiveBuilder.create().matchAny(({ n }) => t.is(1, n)).build()

	selfActor.getActor().context.become(behavior)

	selfActor.tell({ n: 1 })

	selfActor.getActor().context.stop()

})

test("change the behavior of self while self is living", t => {
	t.plan(2)
	class ChangeBehavior { }
	class NewBehavior { }
	const system = new ActorSystem("testSystem")

	class BahaviorActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(ChangeBehavior, () => {
					t.pass()
					const newBehavior = this.receiveBuilder().match(NewBehavior, () => t.pass()).build()
					this.context.become(newBehavior)
				})
				.build()
		}
	}

	const behaviorActor = system.actorOf(new BahaviorActor)
	behaviorActor.tell(new ChangeBehavior)
	behaviorActor.tell(new ChangeBehavior)
	behaviorActor.tell(new NewBehavior)
	behaviorActor.tell(new ChangeBehavior)

	system.terminal()
})