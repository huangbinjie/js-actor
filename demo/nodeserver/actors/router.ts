import { AbstractActor } from "../../../src/AbstractActor"
import { ActorRef } from "../../../src/ActorRef"
import { Controller } from "./controller"
import { Request } from "../messages/server_request"

export class Router extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Request, request => {
				// dynamic allocate actor to run logic 
				const controllerRef = this.context.actorOf(new Controller)
				controllerRef.tell(request)
				this.context.stop()
			})
			.matchAny(() => {/* 404 */ })
			.build()
	}
}