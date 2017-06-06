import { AbstractActor } from "../../src/AbstractActor"
import { Greeting } from "./entities/greeting.entity"

export class Printer extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Greeting, greeting => console.info(greeting.message))
			.build()
	}
}