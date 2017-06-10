import { EventEmitter } from "events"
import { Listener } from "./ActorSystem"

/** a schedule service to listen current system's event stream
 *  for performance perspective，current implemantation all listen system, not listen actor respective
 */
export class Scheduler {
	private callback = (value: Object) => {

		for (let listener of this.listeners) {
			if (listener.message && value instanceof listener.message) return listener.callback(value)
		}

		const defaultListener = this.listeners.find(listener => !!listener.message)

		if (defaultListener) defaultListener.callback({})
	}

	constructor(private eventStream: EventEmitter, private event: string, private listeners: Listener[]) { }

	public cancel() {
		try {
			this.eventStream.removeListener(this.event, this.callback)
		} catch (e) {
			return false
		}
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
}