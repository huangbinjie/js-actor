import { ActorSystem } from "../../src/ActorSystem"
import { ServerResquest } from "./actors/request"
import { Request } from "./messages/server_request"

const app = ActorSystem.create("ectoApp")

const requestActor = app.actorOf(new ServerResquest)

requestActor.tell(new Request("url.com/?say=" + process.argv[2]))