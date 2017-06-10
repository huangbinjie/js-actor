import { ActorContext } from "./ActorContext"
import { ReceiveBuilder } from "./ReceiveBuilder"
import { Receive } from "./Receive"
import { Scheduler } from "./Scheduler"

/** 
 * abstract class that should be extended to create self actor
 */
export abstract class AbstractActor {
	private _context: ActorContext
	protected abstract createReceive(): Receive

	public get context() {
		return this._context
	}

	public set context(context: ActorContext) {
		this._context = context
	}

	protected getSelf() {
		return this.context.self
	}

	protected getSender() {
		return this.context.sender
	}

	public receive() {
		const listeners = this.createReceive().getListener()
		const eventStream = this.context.system.eventStream
		this.context.scheduler = new Scheduler(eventStream, this.context.name, listeners)
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

}