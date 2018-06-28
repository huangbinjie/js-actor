import { Message } from "./Message";
import { IActorReceive } from "./IActorReceive";

export interface IActorReceiveBuilder {
  match(message: Message<any>, callback: (obj: any) => any): IActorReceiveBuilder
  matchAny(callback: (obj: any) => any): IActorReceiveBuilder
  build(): IActorReceive
}
