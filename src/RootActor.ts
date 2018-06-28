import { AbstractActor } from "./AbstractActor"
import { IActorReceive } from ".";

/** the root of the created system actor tree */
export class RootActor extends AbstractActor {
  public createReceive(): IActorReceive {
    return this.receiveBuilder().build()
  }
}
