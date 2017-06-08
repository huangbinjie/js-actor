import { ActorSystem } from "../../src/ActorSystem"
import { Printer } from "./actors/printer.actor"
import { Greeter } from "./actors/greeting.actor"

import { Greet } from "./entities/greet.entity"
import { Greeting } from "./entities/greeting.entity"
import { WhoToGreet } from "./entities/whoToGreet.entity"

const system = ActorSystem.create("helloactor")

const printerActor = system.actorOf(new Printer, "printerActor")

const howdyGreeter = system.actorOf(new Greeter("Howdy", printerActor), "howdyGreeter")

howdyGreeter.tell(new WhoToGreet("Actor"))
howdyGreeter.tell(new Greet())

howdyGreeter.tell(new WhoToGreet("Lightbend"))
howdyGreeter.tell(new Greet())

console.log(howdyGreeter.getActor().isAlive()) // true

system.stop(howdyGreeter)

howdyGreeter.tell(new WhoToGreet("corol"))
howdyGreeter.tell(new Greet()) // nothing

console.log(howdyGreeter.getActor().isAlive()) // false

system.terminal()