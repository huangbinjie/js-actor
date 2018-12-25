import { ActorRef, ActorSystem, IActorScheduler, IActor } from "..";
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

  actorOf<T extends IActor>(actor: T, name?: string): ActorRef<T>
  child(name: string): ActorRef | undefined
  get<T extends IActor>(token: new () => T): ActorRef<T> | undefined
  stop(actorRef?: ActorRef): void
  become(behavior: IActorReceive): void
  isAlive(): boolean
}