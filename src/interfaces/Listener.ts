import { Message } from "./Message";

export type Listener<T = object, Y = "tell" | "ask"> = {
  message?: Message<T>
  type: Y,
  callback: Y extends "ask" ? (resolve: (value?: any | PromiseLike<any>) => void, reject: (reason?: any) => void) => (value: any) => void : (value: any) => any
}