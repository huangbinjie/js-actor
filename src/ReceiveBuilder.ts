import { ActorSystem, Listener } from "./ActorSystem"
import { Receive } from "./Receive"

export class ReceiveBuilder {
	private listeners: Listener[] = []

	public static create(system: ActorSystem) {
		return new ReceiveBuilder(system)
	}

	public match<T extends object>(message: Listener<T>["message"], callback: Listener<T>["callback"]) {
		this.listeners.push({ message, callback })
		return this
	}

	public build() {
		return new Receive(this.system, this.listeners)
	}

	constructor(private system: ActorSystem) {

	}
}