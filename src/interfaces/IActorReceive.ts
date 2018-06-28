import { Listener } from "./Listener";

export interface IActorReceive<L = Listener> {
  listeners: L[]
}