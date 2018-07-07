import { Message } from "./Message"
import { IActorReceive } from "./IActorReceive"

export interface IActorReceiveBuilder {
  match<T1, T2, T3, T4, T5>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>], callback: (obj: T1 | T2 | T3 | T4 | T5) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>], callback: (obj: any) => T1 | T2 | T3 | T4): IActorReceiveBuilder
  match<T1, T2, T3, T4>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3>(messages: [Message<T1>, Message<T2>, Message<T3>], callback: (obj: T1 | T2 | T3) => any): IActorReceiveBuilder
  match<T1, T2, T3>(messages: [Message<T1>, Message<T2>, Message<T3>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2>(messages: [Message<T1>, Message<T2>], callback: (obj: T1 | T2) => any): IActorReceiveBuilder
  match<T1, T2>(messages: [Message<T1>, Message<T2>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1>(messages: [Message<T1>], callback: (obj: T1) => any): IActorReceiveBuilder
  match<T1>(messages: [Message<T1>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T>(message: Message<T>, callback: (obj: T) => any): IActorReceiveBuilder
  match(message: Message<any> | Message<any[]>, callback: (obj: any) => any): IActorReceiveBuilder
  matchAny(callback: (obj: any) => any): IActorReceiveBuilder
  build(): IActorReceive
}
