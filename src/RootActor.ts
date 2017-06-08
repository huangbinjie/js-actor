import { AbstractActor } from "./AbstractActor"

export class RootActor extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder().build()
	}
}
