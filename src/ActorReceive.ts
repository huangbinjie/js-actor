import { IActorReceive } from "./interfaces/IActorReceive";
import { Listener } from "./interfaces/Listener";

export class ActorReceive implements IActorReceive {
	constructor(public listeners: Listener[]) {
	}
}