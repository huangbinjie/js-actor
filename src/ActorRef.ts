import { AbstractActor } from "./AbstractActor"
import { ActorSystem } from "./ActorSystem"
import { ActorContext } from "./ActorContext"
import { ActorScheduler } from ".";
import { Listener } from "./interfaces/Listener";

/** handle reference to an actor, whitch may reside on an actor or root actor */
export class ActorRef {
	private context: ActorContext
	constructor(
		private actor: AbstractActor,
		private system: ActorSystem,
		private listeners: Listener[],
		private parent: ActorRef,
		private path: string,
		public name: string,
	) {
		// create a default scheduler, the actural scheduler will be set in actor.receive()
		const scheduler = new ActorScheduler(system.eventStream, name, listeners, actor)
		this.context = new ActorContext(name, this, system, null, scheduler, parent, path)

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

		this.system.tell(this.name, message)
	}
}
