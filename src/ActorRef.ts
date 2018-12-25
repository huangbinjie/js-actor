import { ActorSystem } from "./ActorSystem"
import { ActorContext } from "./ActorContext"
import { ActorScheduler } from ".";
import { Listener } from "./interfaces/Listener";
import { IActor } from "./interfaces/IActor";

/** handle reference to an actor, whitch may reside on an actor or root actor */
export class ActorRef<T extends IActor = IActor> {
	constructor(
		private actor: T,
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

	public getInstance() {
		return this.actor
	}

	public getContext() {
		return this.actor.context
	}

	public tell(message: object, sender?: ActorRef) {
		this.actor.context.sender = sender || null
		this.actor.context.scheduler.callback(message)
	}

	public ask<T = any>(message: object, sender?: ActorRef): Promise<T> {
		this.actor.context.sender = sender || null
		const result = this.actor.context.scheduler.callback(message)
		if (result && result.then) {
			return result
		} else {
			throw TypeError(`Please use ".answer" to catch ${Object.getPrototypeOf(message).constructor.name}`)
		}
	}
}
