import { AbstractActor } from "./AbstractActor"
import { ActorSystem } from "./ActorSystem"

export class ActorRef {
	constructor(private actor: AbstractActor, private system: ActorSystem) { }

	public tell(message: object, sender?: ActorRef) {
		// TODO: impl dispatch sender
		this.system.dispatch(message)
	}
}
