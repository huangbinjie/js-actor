import { Message } from "./Message"
import { IActorReceive } from "./IActorReceive"

export interface IActorReceiveBuilder {
  match<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>, Message<T10>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6, T7, T8, T9>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6, T7, T8>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6, T7>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3, T4>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2, T3>(messages: [Message<T1>, Message<T2>, Message<T3>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1, T2>(messages: [Message<T1>, Message<T2>], callback: (obj: any) => any): IActorReceiveBuilder
  match<T1>(messages: [Message<T1>], callback: (obj: any) => any): IActorReceiveBuilder
  match(message: Message<any>, callback: (obj: any) => any): IActorReceiveBuilder
  matchAny(callback: (obj: any) => any): IActorReceiveBuilder
  build(): IActorReceive
}
