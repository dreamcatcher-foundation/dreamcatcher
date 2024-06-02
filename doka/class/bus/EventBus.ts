import { type EventSubscription } from "fbemitter";
import { EventEmitter } from "fbemitter";

abstract class IMessageConstructorArgs {
    public abstract at?: string;
    public abstract message?: string;
    public abstract timeout?: bigint;
    public abstract item?: unknown;
}

abstract class IMessage {
    public abstract response(): Promise<unknown>;
}

abstract class IEventConstructorArgs {
    public abstract from?: string;
    public abstract event?: string;
    public abstract item?: unknown;
}

abstract class IMessageSubscriptionConstructorArgs {
    public abstract at?: string;
    public abstract message?: string;
    public abstract handler(item?: unknown): unknown;
    public abstract once?: boolean;
}

abstract class IMessageSubscription {
    public abstract remove(): void;
}

class EventBus {
    private constructor() {}
    private static _questionEventEmitters: {[address: string]: undefined | EventEmitter} = {};
    private static _responseEventEmitters: {[address: string]: undefined | EventEmitter} = {};

    public static Message(args: IMessageConstructorArgs): IMessage {
        const parent: typeof EventBus = this;

        class Message implements IMessage {
            protected _at: string;
            protected _message: string;
            protected _timeout: bigint;
            protected _item?: unknown;

            public constructor(args: IMessageConstructorArgs) {
                this._at = args.at ?? "anonymous";
                this._message = args.message ?? "";
                this._timeout = 0n;
                this._item = args.item;
            }

            public async response(): Promise<unknown> {
                return new Promise(resolve => {
                    let success: boolean = false;
                    let subscription: EventSubscription = parent._responseEventEmitter(this._at).once(this._message, (response: unknown) => {
                        if (!success) {
                            success = true;
                            resolve(response);
                            return;
                        }
                        return;
                    });
                    parent._questionEventEmitter(this._at).emit(this._message, this._item);
                    setTimeout(() => {
                        if (!success) {
                            subscription.remove();
                            resolve(undefined);
                            return;
                        }
                        return;
                    }, Number(this._timeout));
                    return;
                });
            }
        }

        return new Message(args);
    }

    public static Event(args: IEventConstructorArgs) {
        const parent: typeof EventBus = this;

        class Event {
            public constructor(args: IEventConstructorArgs) {
                parent._questionEventEmitter(args.from ?? "anonymous").emit(args.event ?? "", args.item);
            }
        }

        return new Event(args);
    }

    public static MessageSubscription(args: IMessageSubscriptionConstructorArgs): IMessageSubscription {
        const parent: typeof EventBus = this;

        class MessageSubscription implements IMessageSubscription {
            protected _subscription: EventSubscription;

            public constructor(args: IMessageSubscriptionConstructorArgs) {
                this._subscription = 
                    !!args.once
                        ? parent._questionEventEmitter(args.at ?? "anonymous").once(args.message ?? "", (item?: unknown) => parent._responseEventEmitter(args.at ?? "anonymous").emit(args.message ?? "", args.handler(item)))
                        : parent._questionEventEmitter(args.at ?? "anonymous").addListener(args.message ?? "", (item?: unknown) => parent._responseEventEmitter(args.at ?? "anonymous").emit(args.message ?? "", args.handler(item)));
            }

            public remove(): void {
                return this._subscription.remove();
            }
        }

        return new MessageSubscription(args);
    }

    public static EventSubscription() {
        // ... TODO
    }

    protected static _questionEventEmitter(address: string): EventEmitter {
        if (!this._questionEventEmitters[address]) {
            return this._questionEventEmitters[address] = new EventEmitter();
        }
        return this._questionEventEmitters[address]!;
    }

    protected static _responseEventEmitter(address: string): EventEmitter {
        if (!this._responseEventEmitters[address]) {
            return this._responseEventEmitters[address] = new EventEmitter();
        }
        return this._responseEventEmitters[address]!;
    }
}

export { IMessageConstructorArgs };
export { IMessage };
export { IEventConstructorArgs };
export { IMessageSubscription };
export { EventBus };