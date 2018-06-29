import { Message } from "./Message";

export type Listener<T = object> = {
  message?: Message<T>
  callback: (value: any) => any
}