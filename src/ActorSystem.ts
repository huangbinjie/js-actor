import { EventEmitter } from "events"
import { AbstractActor } from "./AbstractActor"
import { ActorRef } from "./ActorRef"

export type Listener<T = object> = {
	message: new (...args: any[]) => T
	callback: (value: T) => void
}

export class ActorSystem {
	public static create(name: string) {
		return new ActorSystem(name)
	}

	private subject = new EventEmitter()
	private actors = new Map()

	public dispatch(message: object) {
		this.subject.emit("message", message)
	}

	public on({ message, callback }: Listener) {
		this.subject.addListener("message", (value: Object) => {
			if (value instanceof message) callback(value)
		})
	}

	public actorOf(actor: AbstractActor, name: string) {
		actor.setSystem(this)
		actor.createReceive()
		this.actors.set(name, actor)
		return new ActorRef(actor, this)
	}

	constructor(private name: string) {
	}
}