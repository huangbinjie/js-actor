import { AbstractActor } from "../../../src/AbstractActor"
import { ActorRef } from "../../../src/ActorRef"
import { ServerResponse } from "./response"
import { Request } from "../messages/server_request"
import { Response } from "../messages/server_response"

export class Controller extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Request, request => {
				const responseActor = this.getContext().actorOf(new ServerResponse)
				// some logic
				const say = request.query.say
				responseActor.tell(new Response(say + "!"))
				this.stop()
			})
			.build()
	}
}