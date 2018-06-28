import { ActorRef, ActorSystem, AbstractActor, IActorScheduler } from "..";
import { IActorReceive } from "./IActorReceive";

export interface IActorContext {
  children: Map<string, ActorRef>
  name: string
  self: ActorRef
  system: ActorSystem
  sender: ActorRef | null
  scheduler: IActorScheduler
  parent: ActorRef
  path: string

  actorOf(actor: AbstractActor, name?: string): ActorRef
  child(name: string): ActorRef | null
  stop(actorRef: ActorRef): void
  become(behavior: IActorReceive): void
  isAlive(): boolean
}