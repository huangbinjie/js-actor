import { ActorContext, IActorReceive, IActorReceiveBuilder } from "..";

export interface IActor {
  context: ActorContext
  createReceive(): IActorReceive
  receiveBuilder(): IActorReceiveBuilder
  receive(): void
  preStart(): void
  postStop(): void
  postError(err: Error): void
}
