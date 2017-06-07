import { ActorSystem, Listener } from "./ActorSystem"
import { Receive } from "./Receive"

/** a helper class to store logic and create receive object */
export class ReceiveBuilder {
	private listeners: Listener[] = []

	public static create(system: ActorSystem) {
		return new ReceiveBuilder(system)
	}

	public match<T extends object>(message: Listener<T>["message"], callback: Listener<T>["callback"]) {
		this.listeners.push({ message, callback })
		return this
	}

	public matchAny(callback: Listener["callback"]) {
		this.listeners.push({ callback })
		return this
	}

	public build() {
		return new Receive(this.listeners)
	}

	constructor(private system: ActorSystem) {

	}
}