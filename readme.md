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

## Doc

you can see the demo for more detail use case. mybe you would like to have a look at akka [quickstart](http://akka.io/try-akka/)