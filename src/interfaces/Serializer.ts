export type Serializer<S = { type: string, payload: object }, T extends (action: object) => any = (action: object) => S> = {
  parse: T
  payload: (action: ReturnType<T>) => object
  match: (obj: S, message: new () => any) => boolean
}
