import { Listener } from "./Listener";

export interface IActorScheduler {
  callback(value: object): void
  cancel(): boolean
  isCancelled(): boolean
  pause(): void
  restart(): void
  start(): void
  replaceListeners(listeners: Listener[]): void
}