import { ActorContext } from "./ActorContext"
import { ActorRef } from "./ActorRef"
import { IActorReceive } from "./interfaces/IActorReceive"
import { ActorReceiveBuilder } from "./ActorReceiveBuilder"
import { ActorScheduler } from "./ActorScheduler"
import { IActorReceiveBuilder } from "."

/** 
 * abstract class that should be extended to create your actor
 */
export abstract class AbstractActor {
	public context!: ActorContext

	protected abstract createReceive(): IActorReceive

	protected getSelf() {
		return this.context.self
	}

	protected getSender() {
		return this.context.sender
	}

	protected receiveBuilder(): IActorReceiveBuilder {
		return ActorReceiveBuilder.create()
	}

	public receive() {
		const listeners = this.createReceive().listeners
		const eventStream = this.context.system.eventStream
		this.context.scheduler = new ActorScheduler(eventStream, this.context.name, listeners, this)
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
