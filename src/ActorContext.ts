import { ActorSystem } from "./ActorSystem"
import { ActorRef } from "./ActorRef"
import { Scheduler } from "./Scheduler"
import { AbstractActor } from "./AbstractActor"
import { v1 } from "uuid"

/** the Actor context.
 *  Exposes contextual information for the actor
 */
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

	public child(name: string): Optional<ActorRef> {
		const child = this._children.get(name)
		if (!!child) {
			for (let child of this._children.values()) {
				const targetActor = child.getActor().getContext().child(name)
				if (targetActor) return targetActor
			}
		}
		return child || null
	}

	public get children() {
		return this._children
	}
	// stop self from parent, elsewise try to stop child
	public stop(actorRef: ActorRef) {
		if (this.self.name === actorRef.name) {
			this.parent!.getActor().getContext().stop(actorRef)
		} else {
			for (let child of this.children.values()) {
				if (child.name === actorRef.name) return child.getActor().stop()
			}
		}
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