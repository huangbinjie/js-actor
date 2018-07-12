import { ActorSystem } from "./ActorSystem"
import { ActorRef } from "./ActorRef"
import { ActorScheduler } from "./ActorScheduler"
import { AbstractActor } from "./AbstractActor"
import { ActorReceive } from "./ActorReceive"
import { IActorContext } from "./interfaces/IActorContext"
import { generate } from "shortid"
import { IActorScheduler } from "./interfaces/IActorScheduler";

/** the Actor context.
 *  Exposes contextual information for the actor
 */
export class ActorContext implements IActorContext {
	public children = new Map<string, ActorRef>()

	constructor(
		public name: string,
		public self: ActorRef,
		public system: ActorSystem,
		public sender: ActorRef | null,
		public scheduler: IActorScheduler,
		public parent: ActorRef,
		public path: string,
	) { }

	public actorOf(actor: AbstractActor, name = generate()) {
		const actorRef = new ActorRef(actor, this.system, [], this.self, this.path + "/" + name, name)
		this.children.set(name, actorRef)
		actor.receive()
		return actorRef
	}

	public child(name: string): ActorRef | undefined {
		return this.children.get(name)
	}

	/** stop self from parent, elsewise try to stop child
	 *  stop should remove listener and delete the referece at children map.
	 *  this is a recursive operation, so give an accurate parent to stop
	 *  is match better than system.stop()
	 *  @param actorRef
	 */
	public stop(actorRef = this.self) {
		const context = actorRef.getActor().context
		if (this.self.getActor().context.path === context.path) {
			this.parent.getActor().context.stop(actorRef)
		} else {
			const child = this.children.get(context.name)!
			let sdu = child.getActor().context.scheduler
			sdu.cancel()
			child.getActor().postStop()
			for (let grandchild of child.getActor().context.children.values()) {
				grandchild.getActor().context.stop()
			}
			this.children.delete(context.name)
		}
	}

	/**
	 * change the Actor's behavior to become the new "Receive" handler.
	 * @param behavior 
	 */
	public become(behavior: ActorReceive) {
		this.scheduler.cancel()
		const listeners = behavior.listeners
		this.scheduler.replaceListeners(listeners)
		this.scheduler.start()
	}

	public isAlive() {
		return this.scheduler ? !this.scheduler.isCancelled() : false
	}
}
