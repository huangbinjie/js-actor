import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"

const system = new ActorSystem("testSystem")

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

	const testActor = system.actorOf(new TestActor)

	t.is(system.eventStream.eventNames().length, 0)
})

test("match", t => {
	t.plan(3)
	class TestActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Entity, entity => {
					t.is("test", entity.message)
				})
				.match([Entity1], entity => {
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
	testActor.tell(new Entity1("test"))
})

test("tell should not go through system.eventStream", t => {
	t.plan(2)
	class LoggerActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Entity, entity => t.is(entity.message, "1"))
				.matchAny(obj => t.is(obj.n, 1))
				.build()
		}

		public preStart() {
			this.context.system.eventStream.on("*", function ({ n }) {
				// should not pass
				t.pass()
			})
		}
	}

	const logger = system.actorOf(new LoggerActor, "logger")
	logger.tell({ n: 1 })
	logger.tell(new Entity("1"))
})


test("logging every message passthrough system", t => {
	t.plan(2)
	class LoggerActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.build()
		}

		public preStart() {
			this.context.system.eventStream.on("**", function ({ n }) {
				t.truthy(n)
			})
		}

		public postStop() {
			// stop listener
		}
	}

	const logger = system.actorOf(new LoggerActor, "logger")
	system.tell("anyMessage", { n: 1 })
	system.tell("root/logger", { n: 2 })
})

test("logging self message", t => {
	t.plan(1)
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
