import { EventEmitter2 } from "eventemitter2"
import { Listener } from "./interfaces/Listener"
import { IActorScheduler } from "./interfaces/IActorScheduler"
import { IActor } from "./interfaces/IActor";

/** a schedule service to listen current system's event stream
 *  for performance perspective，current implemantation all listen system, not listen actor respective
 */
export class ActorScheduler implements IActorScheduler {
	protected defaultListener?: Listener

	constructor(
		protected eventStream: EventEmitter2,
		protected event: string,
		protected listeners: Listener[],
		protected owner: IActor
	) {
		this.defaultListener = this.listeners.find(listener => !listener.message)
	}

	public getListeners() {
		return this.listeners
	}

	public callback = (value: object) => {
		const listener = this.listeners.find(listener => !!listener.message && value instanceof listener.message)
		try {
			if (listener) {
				if (listener.type === "ask") {
					const callback = listener.callback as Listener<object, "ask">["callback"]
					return new Promise((resolve, reject) => {
						callback(resolve, reject)(value)
					})
				} else {
					const callback = listener.callback as Listener<object, "tell">["callback"]
					callback(value)
				}
			} else {
				if (this.defaultListener) {
					const callback = this.defaultListener.callback as Listener<object, "tell">["callback"]
					callback(value)
				}
			}
		} catch (e) {
			this.owner.postError(e)
		}

	}

	public cancel() {
		this.eventStream.removeListener(this.event, this.callback)
		return true
	}

	public isCancelled() {
		return !this.eventStream.listeners(this.event).length
	}

	public pause() {
		this.cancel()
	}

	public restart() {
		this.cancel()
		this.start()
	}

	public start() {
		this.eventStream.addListener(this.event, this.callback)
	}

	public replaceListeners(listeners: Listener[]) {
		this.listeners = listeners
		this.defaultListener = this.listeners.find(listener => !listener.message)
	}
}
