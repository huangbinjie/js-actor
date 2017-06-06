import { ActorSystem, Listener } from "./ActorSystem"

export class Receive {
	constructor(private system: ActorSystem, private listeners: Listener[]) {
		this.listeners.forEach(listener => this.system.on(listener))
	}
}