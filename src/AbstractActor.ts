import { ActorSystem, Listener } from "./ActorSystem"
import { ReceiveBuilder } from "./ReceiveBuilder"
import { Receive } from "./Receive"
export abstract class AbstractActor {
	private system: ActorSystem
	public abstract createReceive(): Receive

	public setSystem(system: ActorSystem) {
		this.system = system
	}

	public getSystem() {
		return this.system
	}

	public receiveBuilder() {
		return ReceiveBuilder.create(this.system)
	}

}