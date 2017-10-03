import { ActorSystem } from "./ActorSystem"
import { ActorRef } from "./ActorRef"
import { Scheduler } from "./Scheduler"
import { AbstractActor } from "./AbstractActor"
import { Receive } from "./Receive"
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
	public scheduler?: Scheduler
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
	/** stop self from parent, elsewise try to stop child
	 *  stop should remove listener and delete the referece at children map.
	 *  this is a recursive operation, so give an accurate parent to stop
	 *  is match better than system.stop()
	 *  @param actorRef
	 */
	public stop(actorRef = this.self) {
		if (this.self.name === actorRef.name) {
			this.parent.getContext().stop(actorRef)
		} else {
			const child = this.children.get(actorRef.name)!
			let sdu = child.getContext().scheduler
			if (sdu) sdu.cancel()
			child.getActor().postStop()
			for (let grandchild of child.getContext().children.values()) {
				grandchild.getContext().stop()
			}
			this.children.delete(actorRef.name)
		}
	}

	/**
	 * change the Actor's behavior to become the new "Receive" handler.
	 * @param behavior 
	 */
	public become(behavior: Receive) {
		if (this.scheduler) this.scheduler.cancel()
		const listeners = behavior.getListener()
		const eventStream = this.system.eventStream
		this.scheduler = new Scheduler(eventStream, this.name, listeners, this.self.getActor())
		this.scheduler.start()
	}

	public isAlive() {
		return this.scheduler ? !this.scheduler.isCancelled() : false
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