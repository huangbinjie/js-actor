import { ActorSystem } from "./ActorSystem"
import { ActorRef } from "./ActorRef"
import { Scheduler } from "./Scheduler"

export class ActorContext implements IContext {
	public name: string
	public self: ActorRef
	public system: ActorSystem
	// TODO noSender
	public sender: Optional<ActorRef>
	public scheduler: Scheduler
	constructor(initialContext: IContext) {
		Object.assign(this, initialContext)
	}
}

export interface IContext {
	name: string
	self: ActorRef,
	system: ActorSystem,
	sender: Optional<ActorRef>
}