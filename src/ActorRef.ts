import { AbstractActor } from "./AbstractActor"
import { ActorSystem } from "./ActorSystem"
import { ActorContext } from "./ActorContext"

/** handle reference to an actor, whitch may reside on an actor or root actor */
export class ActorRef {
	private context: ActorContext
	constructor(
		private actor: AbstractActor,
		private system: ActorSystem,
		public name: string,
		parent: ActorRef,
		path: string
	) {
		this.context = new ActorContext({
			name,
			self: this,
			sender: null,
			system,
			parent,
			path
		})

		actor.context = this.context
	}

	public getContext() {
		return this.context
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
