import { Message } from "./Message"
import { IActorReceive } from "./IActorReceive"

export interface IActorReceiveBuilder {
  match<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>, Message<T10>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10) => void): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6, T7, T8, T9>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9) => void): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6, T7, T8>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8) => void): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6, T7>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7) => void): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5, T6>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6) => void): IActorReceiveBuilder
  match<T1, T2, T3, T4, T5>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>], callback: (value: T1 | T2 | T3 | T4 | T5) => void): IActorReceiveBuilder
  match<T1, T2, T3, T4>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>], callback: (value: T1 | T2 | T3 | T4) => void): IActorReceiveBuilder
  match<T1, T2, T3>(messages: [Message<T1>, Message<T2>, Message<T3>], callback: (value: T1 | T2 | T3) => void): IActorReceiveBuilder
  match<T1, T2>(messages: [Message<T1>, Message<T2>], callback: (value: T1 | T2) => void): IActorReceiveBuilder
  match<T1>(messages: [Message<T1>], callback: (values: T1) => void): IActorReceiveBuilder
  match(message: Message<any>, callback: (obj: any) => any): IActorReceiveBuilder
  matchAny(callback: (obj: any) => any): IActorReceiveBuilder
  build(): IActorReceive
}
