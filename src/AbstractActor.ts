import { ActorContext } from "./ActorContext"
import { IActorReceive } from "./interfaces/IActorReceive"
import { IActorReceiveBuilder } from "."

/** 
 * abstract class that should be extended to create your actor
 */
export abstract class AbstractActor {
	public context!: ActorContext

	protected abstract createReceive(): IActorReceive
	protected abstract receiveBuilder(): IActorReceiveBuilder

	protected getSelf() {
		return this.context.self
	}

	protected getSender() {
		return this.context.sender
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

}
