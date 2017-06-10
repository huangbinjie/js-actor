import { AbstractActor } from "../../../src/AbstractActor"
import { Response } from "../messages/server_response"

export class ServerResponse extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Response, response => {
				console.info("response: " + response.body)
				this.stop()
			})
			.build()
	}
}
