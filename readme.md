# js-actor

An javascript version actor, inspired by Akka Actor

## Installation

```sh
npm i js-actor --save
```

## Quick Start

run your first actor is simple as follow:

```ts
import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"

// create an actor system
const system = ActorSystem.create("systemName")

// create a message object
class Greeting {
	constructor(public message: string) {}
}

// create an actor
class MyActor extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Greeting, greeting => console.log(greeting.message))
			.build()
	}
}

// mount actor to system, return an ActorRef object
const myActor =  system.actorOf(new MyActor)

// myactor is ready an listening, send message to it.
myActor.tell(new Greeting("hello~"))

```

will print

```sh
hello~
```

## Document

### ActorSystem

ActorSystem is a heavyweight structure that theoretically should allocate thread, but in js just allocate listener. imagine your computing unit as a realword actor, the ActorSystem is the stage that give the all actor to work upon it. all actor listen ActorSystem. so create on for per logic application.

#### create(name: string, maxListeners: number): ActorSystem

create an ActorSystem. Is equal to `new ActorSystem(name: string, maxListeners: number)`.

+ name. ActorSystem's name. in some scene will make sense.
+ maxListeners. limit ActorSystem's listener by useing `events` api `setMaxListeners`

#### eventStream: EventEmitter

the event stream of the ActorSystem. All actor should listen it.

#### dispatch(event: string, message: object): void

call emit on eventStream

+ event. actor name
+ message: Message object's entity

#### actorOf(actor: AbstractActor, name = generate()): ActorRef

is equal to ActorContext.actorOf

#### getRoot: ActorRef

ActorSystem implicitly initiate an rootActor that all user custom actor will mount under it. this method can get it.

#### stop(actorRef: ActorRef): void 

is equal to ActorContext.stop.

#### terminal(): void

remove all listener and clear the children of the rootActor.

### ActorContext

expose contextual information for your actor.

#### name: string

actor name

#### self: ActorRef

return reference of self.

#### system: ActorSystem

return the ActorSystem which the actor is using.

#### sender: ActorRef | null

return the reference of sender. if there no sender, it would be null.

#### scheduler: Scheduler

current scheduler of the actor.

#### parent: ActorRef

return parent actor reference

#### path: string

path is composed of parent path and actor name. because root path is `/`, so your first actor path is `/firstname/`.your child actor path is `/firstname/childname/`.and so on.

#### children: Map<string, ActorRef>

return children

#### actorOf(actor: AbstractActor, name = generate()): ActorRef

regist actor to parent actor use the given name. return the reference of your actor that have mounted under parent actor.

+ actor. which actor you want to mount under parent.
+ name. actor name.if name is undefined, it will be random.

#### child(name: string): ActorRef | null

recursively find child use the given actor name from current actor. this method just find children of given actor.

+ name. which actor name that you want to find

#### stop(actorRef = this.self)

this method can stop self and children actor. it will remove the listener of the stopped actor. and remove the reference from parent.

+ actorRef. which actor you want to stop.default is stop self.


#### become(behavior: Receive): void

change the Actor's behavior to become the new "Receive" handler.eg.

```ts
// create a new Receive object
const behavior = ReceiveBuilder.create().build()
// the actor will drop previous receive object and use new receive
actor.getContext().become(behavior)
```

#### isAlive(): boolean

return if the actor is listening.

### AbstractActor

abstract class that should be extended to create your actor.

```ts
class MyActor extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Greeting, greeting => console.log(greeting.message))
			.build()
	}
}
```

#### context: ActorContext

return context of the actor.

#### getSelf(): ActorRef

equal to `this.context.self`

#### getSender(): ActorRef | null

equal to `this.context.sender`

#### receiveBuilder: ReceiveBuilder

return `new ReceiveBuilder`

#### createReceive()?: Receive

if this method have been implemented, it must return a Receive object. there's a convenient build-in method `receiveBuilder` to help your create an Receive object.
if this method havn't be implemented, the actor will not listen the ActorSystem.

#### preStart() void

is called when actor is started

#### postStop() void

is called after `ActorContext.stop()` is invoked

### ActorRef

handle reference to an actor, whitch may reside on an actor.

#### getContext(): ActorContext

return the context of the actor

#### getActor(): AbstractActor

return the inside actor.

#### tell(message: object, sender?: ActorRef)

transfer message to specific actor.

+ message. message object.
+ sender.

```ts
targetActorRef.tell(new Greeting, this.getSelf())
```

### ReceiveBuilder

a helper class to store logic and create receive object

#### match<T extends object>(message: Listener<T>["message"], callback: Listener<T>["callback"]): this

+ message. message class.
+ callback. if matched. pass the message object to the callback.

#### matchAny(callback: (obj: any) => void): this

just like the default in `switch`.

#### build(): Receive

return receive object.

## Other

mybe you would like to have a look at akka [quickstart](http://akka.io/try-akka/) to get the intuitive sense. and contrast with [official api](http://doc.akka.io/api/akka/current/akka/index.html)