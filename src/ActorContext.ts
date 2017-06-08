import { ActorSystem } from "./ActorSystem"
import { ActorRef } from "./ActorRef"
import { Scheduler } from "./Scheduler"
import { AbstractActor } from "./AbstractActor"
import { v1 } from "uuid"

export class ActorContext implements IContext {
	private _children = new Map<string, ActorRef>()

	public name: string
	public self: ActorRef
	public system: ActorSystem
	public sender: Optional<ActorRef> = null
	public scheduler: Scheduler
	public parent: Optional<ActorRef> = null
	public path: string

	public actorOf(actor: AbstractActor, name = v1()) {
		const actorRef = new ActorRef(actor, this.system, name, this.self, this.path + name)
		this._children.set(name, actorRef)
		actor.receive()
		return actorRef
	}

	public child(name: string) {
		return this._children.get(name)
	}

	public get children() {
		return this._children
	}

	public stop(actorRef: ActorRef) {
		this.children.delete(actorRef.name)
		const actor = actorRef.getActor()
		actor.stop()
	}

	constructor(initialContext: IContext) {
		Object.assign(this, initialContext)
	}
}

export interface IContext {
	name: string
	self: ActorRef,
	system: ActorSystem,
	sender: Optional<ActorRef>,
	parent: Optional<ActorRef>,
	path: string
}