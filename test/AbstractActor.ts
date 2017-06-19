import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"

const system = new ActorSystem("testSystem")

class Entity {
	constructor(public message: string) { }
}

test("match", t => {
	t.plan(2)
	class TestActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Entity, entity => {
					t.is("test", entity.message)
				})
				.matchAny(obj => {
					t.is("testAny", obj.message)
				})
				.build()
		}
	}

	const testActor = system.actorOf(new TestActor)
	testActor.tell({ message: "testAny" })
	testActor.tell(new Entity("test"))
})
