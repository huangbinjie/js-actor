import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"

const system = new ActorSystem("testSystem")

test("find grandchild", t => {
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

	const selfActor = system.actorOf(new Self, "self")
	const childActor = selfActor.getContext().actorOf(new Child, "child")
	const grandchild = childActor.getContext().actorOf(new Grandchild, "grandchild")

	const grandChildActor = selfActor.getContext().child("grandchild")
	t.truthy(grandChildActor)
	const grandChildContext = grandChildActor.getContext()
	t.is(grandChildContext.path, "/self/child/grandchild/")
	t.is(grandChildContext.name, "grandchild")
})