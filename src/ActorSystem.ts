import { EventEmitter2 } from "eventemitter2"
import { ActorRef } from "./ActorRef"
import { RootActor } from "./RootActor"
import { generate } from "shortid"
import { IActor } from "./interfaces/IActor";
import { Serializer } from "./interfaces/Serializer";


/** An ActorSystem is a heavyweight structure that will allocate listenner.
 * 	All actor should listen the eventStream of ActorSystem.
 *  So create one per logical application. 
*/
export class ActorSystem {
	private readonly rootActorRef = new ActorRef(new RootActor, this, [], {} as ActorRef, "root", "root")
	
	public serializer: Serializer = {
		parse: message => ({ type: Object.getPrototypeOf(message).constructor.name, payload: message }),
		payload: action => action.payload,
		match: (messageInc, message) => messageInc.type === message.name
	}

	public static create(name: string, serialize?: boolean) {
		return new ActorSystem(name, serialize)
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
		const serializedMessage = this.serialize && this.serializer.parse(message) || message
		if (volume > 0) {
			Array.from({ length: volume }).forEach((_, n) => {
				const wildcardPath = Array(n + 1).fill("*").join("/")
				this.eventStream.emit(to + wildcardPath, serializedMessage)
			})
		} else {
			this.eventStream.emit(to + "*/**", serializedMessage)
		}
	}

	// Create new actor as child of this context and give it an automatically generated name
	public actorOf<T extends IActor>(actor: T, name = generate()) {
		return this.rootActorRef.getInstance().context.actorOf(actor, name)
	}

	public getRoot() {
		return this.rootActorRef
	}

	public get<T extends IActor>(token: new (...args: any[]) => T): ActorRef<T> | undefined {
		return this.getRoot().getInstance().context.get(token)
	}

	public stop(actorRef: ActorRef) {
		this.rootActorRef.getInstance().context.stop(actorRef)
	}

	/* release all listener, and clear rootActor's children */
	public terminal() {
		this.eventStream.removeAllListeners()
		this.rootActorRef.getInstance().context.children.clear()
	}

	constructor(public name: string, public serialize?: boolean) {
		this.eventStream = new EventEmitter2({
			delimiter: "/",
			wildcard: true,
			verboseMemoryLeak: true
		})
	}
}
