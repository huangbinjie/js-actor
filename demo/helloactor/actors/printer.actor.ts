import { AbstractActor } from "../../../src/AbstractActor"
import { Greeting } from "../entities/greeting.entity"
import { Replay } from "../entities/reply.entity"

export class Printer extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Greeting, greeting => {
				this.getSender()!.tell(new Replay(greeting.message), this.getSelf())
			})
			.matchAny(() => console.warn("got unknow message"))
			.build()
	}
}