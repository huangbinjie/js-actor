import { ActorContext } from "./ActorContext"
import { IActorReceive } from "./interfaces/IActorReceive"
import { ActorReceiveBuilder } from "./ActorReceiveBuilder"
import { IActor } from "./interfaces/IActor";

/** 
 * abstract class that should be extended to create your actor
 */
export abstract class AbstractActor implements IActor {
	public context!: ActorContext

	public abstract createReceive(): IActorReceive

	public receiveBuilder() {
		return ActorReceiveBuilder.create()
	}

	public receive() {
		const listeners = this.createReceive().listeners
		this.context.scheduler.replaceListeners(listeners)
		this.context.scheduler.start()
		this.preStart()
	}

	/** is called when actor is started*/
	public preStart() {

	}

	/** is called after getContext().stop() is invoked */
	public postStop() {

	}

	/** is called after Receive got error */
	public postError(err: Error) {
		throw err
	}

	protected getSelf() {
		return this.context.self
	}

	protected getSender() {
		return this.context.sender
	}

}
