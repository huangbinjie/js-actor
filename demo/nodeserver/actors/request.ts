import { ActorSystem } from "../../../src/ActorSystem"
import { AbstractActor } from "../../../src/AbstractActor"
import { ActorRef } from "../../../src/ActorRef"
import { Router } from "./router"
import { Request } from "../messages/server_request"

export class ServerResquest extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Request, request => {
				const routerActor = this.getContext().actorOf(new Router)
				routerActor.tell(request, this.getSelf())
			})
			.build()
	}
}
