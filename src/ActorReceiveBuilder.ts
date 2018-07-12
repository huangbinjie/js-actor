import { ActorSystem } from "./ActorSystem"
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

	public match<T extends object>(message: Message<T> | Message<object>[], callback: Listener<T>["callback"]) {
		if (Array.isArray(message)) {
			message.forEach(message => this.listeners.push({ message, callback }))
		} else {
			this.listeners.push({ message, callback })
		}
		return this
	}

	public matchAny(callback: (obj: any) => void) {
		this.listeners.push({ callback })
		return this
	}

	public build(): IActorReceive {
		return new ActorReceive(this.listeners)
	}
}