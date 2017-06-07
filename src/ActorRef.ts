import { AbstractActor } from "./AbstractActor"
import { ActorSystem } from "./ActorSystem"
import { ActorContext } from "./ActorContext"

export class ActorRef {
	constructor(private actor: AbstractActor, private system: ActorSystem, public name: string) {
		const context = new ActorContext({
			name: name,
			self: this,
			sender: null,
			system: system
		})

		actor.context = context
	}

	public getActor() {
		return this.actor
	}

	public tell(message: object, sender?: ActorRef) {
		this.actor.context.sender = sender || null
		// TODO: impl dispatch sender
		this.system.dispatch(this.name, message)
	}
}
