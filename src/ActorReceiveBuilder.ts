import { Listener } from "./interfaces/Listener"
import { Message } from "./interfaces/Message"
import { IActorReceiveBuilder } from "./interfaces/IActorReceiveBuilder"
import { IActorReceive } from "./interfaces/IActorReceive"
import { ActorReceive } from "./ActorReceive"

/** a helper class to store logic and create receive object */
export class ActorReceiveBuilder implements IActorReceiveBuilder {
	private listeners: Listener<any>[] = []

	public static create() {
		return new ActorReceiveBuilder()
	}

	public match<T extends object>(message: Message<T>, callback: (value: T) => void) {
		this.listeners.push({ message, type: "tell", callback })
		return this
	}

	public answer<S, T>(message: Message<T>, callback: (resolve: (value?: S | PromiseLike<S>) => void, reject: (reason?: any) => void) => (value: T) => void) {
		this.listeners.push({ message, type: "ask", callback })
		return this
	}

	public matchAny<T>(callback: (obj: any) => void) {
		this.listeners.push({ type: "tell", callback })
		return this
	}

	public build(): IActorReceive {
		return new ActorReceive(this.listeners)
	}
}
