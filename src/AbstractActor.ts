import { ActorContext } from "./ActorContext"
import { ReceiveBuilder } from "./ReceiveBuilder"
import { Receive } from "./Receive"
import { Scheduler } from "./Scheduler"
export abstract class AbstractActor {
	private context: ActorContext
	protected abstract createReceive(): Receive

	public getContext() {
		return this.context
	}
	public setContext(context: ActorContext) {
		this.context = context
	}
	public getSelf() {
		return this.context.self
	}
	public getSender() {
		return this.context.sender
	}

	public receive() {
		const listeners = this.createReceive().getListener()
		const eventStream = this.context.system.eventStream
		this.context.scheduler = new Scheduler(eventStream, this.context.name, listeners)
	}

	public receiveBuilder() {
		return ReceiveBuilder.create()
	}

	public stop() {
		this.context.scheduler.cancel()
	}

	public alive() {
		return this.context.scheduler.isCancelled()
	}

}