import { EventEmitter2 } from "eventemitter2"
import { AbstractActor } from "./AbstractActor"
import { ActorRef } from "./ActorRef"
import { RootActor } from "./RootActor"
import { generate } from "shortid"


/** An ActorSystem is a heavyweight structure that will allocate listenner.
 * 	All actor should listen the eventStream of ActorSystem.
 *  So create one per logical application. 
*/
export class ActorSystem {
	private readonly rootActorRef = new ActorRef(new RootActor, this, [], {} as ActorRef, "root", "root")

	public static create(name: string) {
		return new ActorSystem(name)
	}

	// Main event bus of this actor system, used for example for logging.
	public readonly eventStream: EventEmitter2

	// tell message to actor by system.eventStream
	public tell(event: string, message: object) {
		this.eventStream.emit(event, message)
	}

	/**
	 * broadcast message all to system.
	 * @param message 
	 * @param volume you can set the volume to positive number
	 * @param to message would broadcast to this node's children. default is "root/"
	 */
	public broadcast(message: object, to = "root/", volume = 0) {
		if (volume > 0) {
			Array.from({ length: volume }).forEach((_, n) => {
				const wildcardPath = Array(n + 1).fill("*").join("/")
				this.eventStream.emit(to + wildcardPath, message)
			})
		} else {
			this.eventStream.emit(to + "*/**", message)
		}
	}

	// Create new actor as child of this context and give it an automatically generated name
	public actorOf(actor: AbstractActor, name = generate()) {
		return this.rootActorRef.getActor().context.actorOf(actor, name)
	}

	public getRoot() {
		return this.rootActorRef
	}

	public stop(actorRef: ActorRef) {
		this.rootActorRef.getActor().context.stop(actorRef)
	}

	/* release all listener, and clear rootActor's children */
	public terminal() {
		this.eventStream.removeAllListeners()
		this.rootActorRef.getActor().context.children.clear()
	}

	constructor(public name: string) {
		this.eventStream = new EventEmitter2({
			delimiter: "/",
			wildcard: true,
			verboseMemoryLeak: true
		})
	}
}
