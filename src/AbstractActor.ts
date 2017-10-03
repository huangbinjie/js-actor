import { ActorContext } from "./ActorContext"
import { ActorRef } from "./ActorRef"
import { ReceiveBuilder } from "./ReceiveBuilder"
import { Receive } from "./Receive"
import { Scheduler } from "./Scheduler"

/** 
 * abstract class that should be extended to create your actor
 */
export abstract class AbstractActor {
	public context: ActorContext
	protected createReceive?(): Receive

	protected getSelf() {
		return this.context.self
	}

	protected getSender() {
		return this.context.sender
	}

	public receive() {
		if (!this.createReceive) return
		const listeners = this.createReceive().getListener()
		const eventStream = this.context.system.eventStream
		this.context.scheduler = new Scheduler(eventStream, this.context.name, listeners, this)
		this.context.scheduler.start()
		this.preStart()
	}

	protected receiveBuilder() {
		return ReceiveBuilder.create()
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