import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"

const system = new ActorSystem("testSystem")

class Entity {
	constructor(public message: string) { }
}


test("no listen", t => {
	class TestActor extends AbstractActor { }

	const testActor = system.actorOf(new TestActor)

	t.is(system.eventStream.eventNames().length, 0)
})

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

test("logging every message passthrough system", t => {
	t.plan(2)
	class LoggerActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.build()
		}

		public preStart() {
			this.context.system.eventStream.on("*", function ({ n }) {
				t.truthy(n)
			})
		}

		public postStop() {
			// stop listener
		}
	}

	const logger = system.actorOf(new LoggerActor, "logger")
	system.tell("anyMessage", { n: 1 })
	system.tell("logger", { n: 2 })
})

test("logging self message", t => {
	t.plan(1)
	class LoggerActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.build()
		}

		public preStart() {
			this.context.system.eventStream.on(this.context.name, function ({ n }) {
				t.is(n, 2)
			})
		}

		public postStop() {
			// stop listener
		}
	}

	const logger = system.actorOf(new LoggerActor, "logger")
	system.tell("anyMessage", { n: 1 })
	system.tell("logger", { n: 2 })
})

test("catch error message", t => {
	class CatchActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Entity, message => { throw Error("some error") })
				.matchAny(({ n }) => t.is(n, 1))
				.build()
		}

		public postError(e: Error) {
			t.is(e.message, "some error")
		}
	}

	const catchActor = system.actorOf(new CatchActor, "catchActor")
	catchActor.tell(new Entity("hello"))
	catchActor.tell({ n: 1 })
})
