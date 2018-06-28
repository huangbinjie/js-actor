export type Listener<T = object> = {
  message?: new (...args: any[]) => T
  callback: (value: T) => void
}