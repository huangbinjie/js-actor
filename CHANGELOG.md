# changelog

## 1.3.0

+ feat: add ask pattern

```ts
const answer = await actorRef.ask(new Question())

receiveBuilder().answer(Question, resolve => question => {
  resolve("This is the answer to the question.")
})
```

## 1.2.1

+ feat: context.get should return ActorRef instead of AbstractActor

## 1.2.0

+ feat: add `get` to system and context.

## 1.1.11

+ refactor: broadcast can now specify parent node.

## 1.1.10

+ feat: add broadcast method to system.
+ fix: ActorRef.tell will call internal actor's scheduler directly.

## 1.1.9

+ add the type parameter to callback argument inside `IActorReceiveBuilder`.

## 1.1.8

+ refactor: extract base interface in order to implements.

## 1.1.4

+ drop `maxListeners`.
+ Refactor Scheduler in order to be extended.

## 1.1.3

+ remove matchArray
+ match method can be pass array now.

## 1.1.2

+ fixed the type error of TypeScript 2.8
+ add matchArray for ReceiveBuilder

## 1.1.1

+ rename system.dispatch to system.tell

## 1.0.8

+ add `become` to ActorContext.

## 1.0.7

+ remove the abstract attribute of `createReceive`.