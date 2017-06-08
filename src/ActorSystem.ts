import { EventEmitter } from "events"
import { AbstractActor } from "./AbstractActor"
import { ActorRef } from "./ActorRef"
import { RootActor } from "./RootActor"
import { v1 } from "uuid"


/** An ActorSystem is a heavyweight structure that will allocate listenner.
 * 	All actor listen ActorSystem's eventStream.
 *  So create one per logical application. 
*/
export class ActorSystem {
	private rootActorRef = new ActorRef(new RootActor, this, "root", null, "/")

	public static create(name: string) {
		return new ActorSystem(name)
	}

	// Main event bus of this actor system, used for example for logging.
	public readonly eventStream = new EventEmitter()

	// dispatch event to listening actor
	public dispatch(event: string, message: object) {
		this.eventStream.emit(event, message)
	}

	// Create new actor as child of this context and give it an automatically generated name
	public actorOf(actor: AbstractActor, name = v1()) {
		return this.rootActorRef.getActor().getContext().actorOf(actor, "/" + name)
	}

	public stop(actorRef: ActorRef) {
		this.rootActorRef.getActor().getContext().stop(actorRef)
	}

	/* release all listener, and clear rootActor's children */
	public terminal() {
		this.eventStream.removeAllListeners()
		this.rootActorRef.getActor().getContext().children.clear()
	}

	constructor(private name: string) { }
}

export type Listener<T = object> = {
	message?: (new (...args: any[]) => T)
	callback: (value: T) => void
}
