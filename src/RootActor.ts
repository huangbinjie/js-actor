import { AbstractActor } from "./AbstractActor"
import { Receive } from "./Receive"

/** the root of the created system actor tree */
export class RootActor extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder().build()
	}
}
