import { Listener } from "./Listener";

export interface IActorScheduler {
  callback(value: object): Promise<any> | void
  cancel(): boolean
  isCancelled(): boolean
  pause(): void
  restart(): void
  start(): void
  getListeners(): Listener[]
  replaceListeners(listeners: Listener[]): void
}