# changelog

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