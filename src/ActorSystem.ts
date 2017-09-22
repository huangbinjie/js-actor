import { EventEmitter2 } from "eventemitter2"
import { AbstractActor } from "./AbstractActor"
import { ActorRef } from "./ActorRef"
import { RootActor } from "./RootActor"
import { generate } from "shortid"


/** An ActorSystem is a heavyweight structure that will allocate listenner.
 * 	All actor listen ActorSystem's eventStream.
 *  So create one per logical application. 
*/
export class ActorSystem {
	private readonly rootActorRef = new ActorRef(new RootActor, this, "root", {} as ActorRef, "/")

	public static create(name: string, maxListeners = 10) {
		return new ActorSystem(name, maxListeners)
	}

	// Main event bus of this actor system, used for example for logging.
	public readonly eventStream: EventEmitter2

	// dispatch event to listening actor
	public dispatch(event: string, message: object) {
		this.eventStream.emit(event, message)
	}

	// Create new actor as child of this context and give it an automatically generated name
	public actorOf(actor: AbstractActor, name = generate()) {
		return this.rootActorRef.getContext().actorOf(actor, name)
	}

	public getRoot() {
		return this.rootActorRef
	}

	public stop(actorRef: ActorRef) {
		this.rootActorRef.getContext().stop(actorRef)
	}

	/* release all listener, and clear rootActor's children */
	public terminal() {
		this.eventStream.removeAllListeners()
		this.rootActorRef.getContext().children.clear()
	}

	constructor(private name: string, private maxListeners = 10) {
		this.eventStream = new EventEmitter2({
			wildcard: true,
			verboseMemoryLeak: true,
			maxListeners
		})
	}
}

export type Listener<T = object> = {
	message?: (new (...args: any[]) => T)
	callback: (value: T) => void
}
