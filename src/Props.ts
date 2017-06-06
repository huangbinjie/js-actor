// import { AbstractActor } from "./AbstractActor"

// /**
//  * a configuration object using in creating an actor
//  */
// export class Props {
// 	public static create(actor: () => new () => AbstractActor) {
// 		const actorObj = actor()
// 		new Props(new actorObj())
// 	}

// 	public setActor(actor: AbstractActor) {
// 		this.actor = actor
// 	}

// 	public getActor() {
// 		return this.actor
// 	}

// 	constructor(private actor: AbstractActor) {

// 	}
// }