import { AbstractActor } from "./AbstractActor"

/** the root of the created system actor tree */
export class RootActor extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder().build()
	}
}
