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

  actorOf<T extends AbstractActor>(actor: T, name?: string): ActorRef<T>
  child(name: string): ActorRef | undefined
  get<T extends AbstractActor>(token: new () => T): ActorRef<T> | undefined
  stop(actorRef?: ActorRef): void
  become(behavior: IActorReceive): void
  isAlive(): boolean
}