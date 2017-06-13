import { ActorSystem } from "./ActorSystem"
import { ActorRef } from "./ActorRef"
import { Scheduler } from "./Scheduler"
import { AbstractActor } from "./AbstractActor"
import { generate } from "shortid"

/** the Actor context.
 *  Exposes contextual information for the actor
 */
export class ActorContext implements IContext {
	private _children = new Map<string, ActorRef>()

	public name: string
	public self: ActorRef
	public system: ActorSystem
	public sender: ActorRef | null = null
	public scheduler: Scheduler
	public parent: ActorRef
	public path: string

	public actorOf(actor: AbstractActor, name = generate()) {
		const actorRef = new ActorRef(actor, this.system, name, this.self, this.path + name + "/")
		this._children.set(name, actorRef)
		actor.receive()
		return actorRef
	}

	public child(name: string): ActorRef | null {
		const child = this._children.get(name)
		if (!child) {
			for (let child of this._children.values()) {
				const targetActor = child.getContext().child(name)
				if (targetActor) return targetActor
			}
		}
		return child || null
	}

	public get children() {
		return this._children
	}
	// stop self from parent, elsewise try to stop child
	public stop(actorRef = this.self) {
		if (this.self.name === actorRef.name) {
			this.parent.getContext().stop(actorRef)
		} else {
			this.children.delete(this.name)
			for (let child of this.children.values()) {
				if (child.name === actorRef.name) {
					child.getContext().scheduler.cancel()
					child.getActor().postStop()
					return
				}
			}
		}
	}

	public isAlive() {
		return !this.scheduler.isCancelled()
	}

	constructor(initialContext: IContext) {
		Object.assign(this, initialContext)
	}
}

export interface IContext {
	name: string
	self: ActorRef,
	system: ActorSystem,
	sender: ActorRef | null,
	parent: ActorRef,
	path: string
}