import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"
import { AbstractActor } from "../src/AbstractActor"

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

test("match", t => {
	t.plan(3)
	const system = new ActorSystem("testSystem")
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

test("ask", async t => {
	t.plan(4)
	const system = new ActorSystem("testSystem")
	class TestActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.answer(Entity, (resolve) => entity => {
					t.pass()
					resolve("i have received your message: " + entity.message)
				})
				.answer(Entity1, (resolve) => entity1 => {
					t.pass()
					resolve("i have received your message: " + entity1.message)
				})
				.build()
		}
	}
	const testActor = system.actorOf(new TestActor)
	const response = await testActor.ask<string>(new Entity("test"))
	const res1 = await testActor.ask<string>(new Entity1("test1"))

	t.is("i have received your message: test", response)
	t.is("i have received your message: test1", res1)
})

test.cb("asynchronous of tell should dependent on what to do.", t => {
	t.plan(2)
	const system = new ActorSystem("testSystem")
	let n = 0
	class TestActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Entity, async ({ message }) => {
					const result = await new Promise(resolve => {
						setTimeout(() => {
							n++
							resolve(n)
						}, 10)
					})
					t.is(result, 1)
				})
				.build()
		}
	}
	const testActor = system.actorOf(new TestActor)
	testActor.tell(new Entity("111"))
	t.is(n, 0)
	setTimeout(() => t.end(), 50)
})

test("catch error message", t => {
	const system = new ActorSystem("testSystem")
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
