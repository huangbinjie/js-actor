import { EventEmitter } from "events"
import { AbstractActor } from "./AbstractActor"
import { ActorRef } from "./ActorRef"
import { RootActor } from "./RootActor"
import { v1 } from "uuid"


/** An ActorSystem is a heavyweight structure that will allocate 1…N Threads, so create one per logical application. */

export class ActorSystem {
	private children = new Map<string, ActorRef>()

	public static create(name: string) {
		return new ActorSystem(name)
	}

	// Main event bus of this actor system, used for example for logging.
	public eventStream = new EventEmitter()

	// dispatch event to listening actor
	public dispatch(event: string, message: object) {
		this.eventStream.emit(event, message)
	}

	// Create new actor as child of this context and give it an automatically generated name
	public actorOf(actor: AbstractActor, name = v1()) {
		const rootActor = new RootActor
		const rootActorRef = new ActorRef(rootActor, this, "root", null, "/")
		const actorRef = new ActorRef(actor, this, name, rootActorRef, "/" + name)
		this.children.set(name, actorRef)
		actor.receive()
		return actorRef
	}

	public stop(actorRef: ActorRef) {
		this.children.delete(actorRef.name)
		const actor = actorRef.getActor()
		actor.stop()
	}

	public terminal() {
		this.eventStream.removeAllListeners()
		this.children.clear()
	}

	constructor(private name: string) { }
}

export type Listener<T = object> = {
	message?: (new (...args: any[]) => T)
	callback: (value: T) => void
}
