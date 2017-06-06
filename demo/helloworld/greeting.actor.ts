import { AbstractActor } from "../../src/AbstractActor"
import { ActorRef } from "../../src/ActorRef"
import { WhoToGreet } from "./entities/whoToGreet.entity"
import { Greet } from "./entities/greet.entity"
import { Greeting } from "./entities/greeting.entity"

export class Greeter extends AbstractActor {
	private greeting = ""

	constructor(private message: string, private printer: ActorRef) { super() }

	public createReceive() {
		return this.receiveBuilder()
			.match(WhoToGreet, wtg => this.greeting = this.message + ", " + wtg.who)
			.match(Greet, () => this.printer.tell(new Greeting(this.greeting)))
			.build()
	}
}