import { Listener } from "./interfaces/Listener"
import { IActorScheduler } from "./interfaces/IActorScheduler"
import { IActor } from "./interfaces/IActor";
import { ActorSystem } from "./ActorSystem";

/** a schedule service to listen current system's event stream
 *  for performance perspective，current implemantation all listen system, not listen actor respective
 */
export class ActorScheduler implements IActorScheduler {
	private defaultListener?: Listener

	constructor(
		private system: ActorSystem,
		private event: string,
		private listeners: Listener[],
		private owner: IActor
	) {
		this.defaultListener = this.listeners.find(listener => !listener.message)
	}

	private matchMessage(value: any, message: new () => any) {
		if (this.system.serialize) {
			return this.system.serializer.match(value, message)
		} else {
			return value instanceof message
		}
	}

	private serializeMessage(value: any) {
		return this.system.serialize && this.system.serializer.parse(value)
	}

	private payload(value: any) {
		return this.system.serialize && this.system.serializer.payload(value) || value
	}

	public getListeners() {
		return this.listeners
	}

	public callback = (value: any) => {
		const listener = this.listeners.find(listener => !!listener.message && this.matchMessage(value, listener.message))
		try {
			if (listener) {
				if (listener.type === "ask") {
					const callback = listener.callback as Listener<object, "ask">["callback"]
					return new Promise((resolve, reject) => {
						callback(resolve, reject)(this.payload(value))
					})
				} else {
					const callback = listener.callback as Listener<object, "tell">["callback"]
					callback(this.payload(value))
				}
			} else {
				if (this.defaultListener) {
					const callback = this.defaultListener.callback as Listener<object, "tell">["callback"]
					callback(this.payload(value))
				}
			}
		} catch (e) {
			this.owner.postError(e)
		}

	}

	public cancel() {
		this.system.eventStream.removeListener(this.event, this.callback)
		return true
	}

	public isCancelled() {
		return !this.system.eventStream.listeners(this.event).length
	}

	public pause() {
		this.cancel()
	}

	public restart() {
		this.cancel()
		this.start()
	}

	public start() {
		this.system.eventStream.addListener(this.event, this.callback)
	}

	public replaceListeners(listeners: Listener[]) {
		this.listeners = listeners
		this.defaultListener = this.listeners.find(listener => !listener.message)
	}

}
