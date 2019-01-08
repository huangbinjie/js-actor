import { ActorContext, IActorReceive, IActorReceiveBuilder, IActorContext } from "..";

export interface IActor {
  context: IActorContext
  createReceive(): IActorReceive
  receiveBuilder(): IActorReceiveBuilder
  receive(): void
  preStart(): void
  postStop(): void
  postError(err: Error): void
}
