import { ActorSystem } from "./ActorSystem"
import { Listener } from "./interfaces/Listener"
import { Message } from "./interfaces/Message"
import { IActorReceiveBuilder } from "./interfaces/IActorReceiveBuilder"
import { IActorReceive } from "./interfaces/IActorReceive"
import { ActorReceive } from "./ActorReceive"

/** a helper class to store logic and create receive object */
export class ActorReceiveBuilder implements IActorReceiveBuilder {
	private listeners: Listener<any>[] = []

	public static create() {
		return new ActorReceiveBuilder()
	}

	public match<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>, Message<T10>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10) => void): this
	public match<T1, T2, T3, T4, T5, T6, T7, T8, T9>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>, Message<T9>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9) => void): this
	public match<T1, T2, T3, T4, T5, T6, T7, T8>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>, Message<T8>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8) => void): this
	public match<T1, T2, T3, T4, T5, T6, T7>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>, Message<T7>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6 | T7) => void): this
	public match<T1, T2, T3, T4, T5, T6>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>, Message<T6>], callback: (value: T1 | T2 | T3 | T4 | T5 | T6) => void): this
	public match<T1, T2, T3, T4, T5>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>, Message<T5>], callback: (value: T1 | T2 | T3 | T4 | T5) => void): this
	public match<T1, T2, T3, T4>(messages: [Message<T1>, Message<T2>, Message<T3>, Message<T4>], callback: (value: T1 | T2 | T3 | T4) => void): this
	public match<T1, T2, T3>(messages: [Message<T1>, Message<T2>, Message<T3>], callback: (value: T1 | T2 | T3) => void): this
	public match<T1, T2>(messages: [Message<T1>, Message<T2>], callback: (value: T1 | T2) => void): this
	public match<T1>(messages: [Message<T1>], callback: (values: T1) => void): this
	public match<T>(messages: Message<T>, callback: (values: T) => void): this
	public match<T extends object>(message: Message<T> | Message<object>[], callback: Listener<T>["callback"]) {
		if (Array.isArray(message)) {
			message.forEach(message => this.listeners.push({ message, callback }))
		} else {
			this.listeners.push({ message, callback })
		}
		return this
	}

	public matchAny(callback: (obj: any) => void) {
		this.listeners.push({ callback })
		return this
	}

	public build(): IActorReceive {
		return new ActorReceive(this.listeners)
	}
}
