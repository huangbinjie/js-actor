import { test } from "ava"
import { ActorSystem } from "../src/ActorSystem"

test("set infinite listener count", t => {
	const system = ActorSystem.create("app", Infinity)
	t.truthy(system)
})