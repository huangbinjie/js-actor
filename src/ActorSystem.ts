import { EventEmitter } from "events"

export class ActorSystem {
	private name: string
	private event$ = new EventEmitter()

	public static create(name: string) {
		return new ActorSystem(name)
	}

	public actorOf() {

	}

	constructor(name: string) {
		this.name = name
	}
}