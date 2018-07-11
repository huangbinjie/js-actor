import { AbstractActor } from "./AbstractActor"
import { ActorSystem } from "./ActorSystem"
import { ActorContext } from "./ActorContext"
import { ActorScheduler } from ".";
import { Listener } from "./interfaces/Listener";

/** handle reference to an actor, whitch may reside on an actor or root actor */
export class ActorRef {
	constructor(
		private actor: AbstractActor,
		system: ActorSystem,
		listeners: Listener[],
		parent: ActorRef,
		path: string,
		name: string,
	) {
		// create a default scheduler, the actural scheduler will be set in actor.receive()
		const scheduler = new ActorScheduler(system.eventStream, path, listeners, actor)
		const context = new ActorContext(name, this, system, null, scheduler, parent, path)

		actor.context = context
	}

	public getActor() {
		return this.actor
	}

	public tell(message: object, sender?: ActorRef) {
		this.actor.context.sender = sender || null
		this.actor.context.scheduler.callback(message)
	}
}
