import { ActorSystem, Listener } from "./ActorSystem"

export class Receive {
	public getListener() {
		return this.listeners
	}
	constructor(private listeners: Listener[]) {
	}
}