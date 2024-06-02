import { type EventSubscription as FbEmitterEventSubscription } from "fbemitter";
import { EventEmitter } from "fbemitter";

abstract class iDispatchArgs {
    public abstract to: string;
    public abstract message: string;
    public abstract timeout: bigint;
    public abstract item: unknown;
}

abstract class iEventDispatchArgs {
    public abstract from: string;
    public abstract event: string;
    public abstract item: unknown;
}

abstract class iSubscriptionArgs {
    public abstract at: string;
    public abstract message: string;
    public abstract hook(item?: unknown): unknown;
    public abstract once?: boolean;
}

abstract class iEventSubscriptionArgs {
    public abstract from: string;
    public abstract event: string;
    public abstract hook(item?: unknown): void;
    public abstract once?: boolean;
}

abstract class iMessage {
    public abstract response(): Promise<unknown>;
}

abstract class iSubscription {
    public abstract remove(): void;
}

class InternalStream {
    private constructor() {}
    protected static _disk: {
        eventsEmitter0: Map<string, EventEmitter | undefined>;
        eventsEmitter1: Map<string, EventEmitter | undefined>;
    } = {
        eventsEmitter0: new Map(),
        eventsEmitter1: new Map()
    };

    public static async dispatch(args: iDispatchArgs): Promise<unknown> {
        return new Promise(resolve => {
            let success: boolean = false;
            const subscription: FbEmitterEventSubscription = this._eventsEmitter1(args.to).once(args.message, (response: unknown) => {
                if (!success) {
                    success = true;
                    resolve(response);
                    return;
                }
                return;
            });
            this._eventsEmitter0(args.to).emit(args.message, args.item);
            setTimeout(() => {
                if (!success) {
                    subscription.remove();
                    resolve(undefined);
                }
                return;
            }, Number(args.timeout));
            return;
        });
    }

    public static dispatchEvent(args: iEventDispatchArgs): void {
        return this._eventsEmitter0(args.from).emit(args.event, args.item);
    }

    public static createSubscription(args: iSubscriptionArgs): FbEmitterEventSubscription {
        if (args.once) {
            return this._eventsEmitter0(args.at).once(args.message, (item?: unknown) => this._eventsEmitter1(args.at).emit(args.message, args.hook(item)));
        }
        return this._eventsEmitter0(args.at).addListener(args.message, (item?: unknown) => this._eventsEmitter1(args.at).emit(args.message, args.hook(item)));
    }

    public static createEventSubscription(args: iEventSubscriptionArgs): FbEmitterEventSubscription {
        if (args.once) {
            return this._eventsEmitter0(args.from).once(args.event, args.hook);
        }
        return this._eventsEmitter0(args.from).addListener(args.event, args.hook);
    }

    protected static _eventsEmitter0(node: string): EventEmitter {
        if (!this._disk.eventsEmitter0.get(node)) {
            return this._disk.eventsEmitter0
                .set(node, new EventEmitter())
                .get(node)!;
        }
        return this._disk.eventsEmitter0.get(node)!;
    }

    protected static _eventsEmitter1(node: string): EventEmitter {
        if (!this._disk.eventsEmitter1.get(node)) {
            return this._disk.eventsEmitter1
                .set(node, new EventEmitter())
                .get(node)!;
        }
        return this._disk.eventsEmitter1.get(node)!;
    }
}

class Message implements iMessage {
    protected _disk: {
        response: Promise<unknown>;
    };

    public constructor(args: iDispatchArgs) {
        this._disk.response = InternalStream.dispatch(args);
    }

    public async response(): Promise<unknown> {
        return await this._disk.response;
    }
}

class Event {
    public constructor(args: iEventDispatchArgs) {
        InternalStream.dispatchEvent(args);
    }
}

class Subscription implements iSubscription {
    protected _disk: {
        subscription: FbEmitterEventSubscription;
    };

    public constructor(args: iSubscriptionArgs) {
        this._disk.subscription = InternalStream.createSubscription(args);
    }

    public remove(): void {
        return this._disk.subscription.remove();
    }
}

class EventSubscription implements iSubscription {
    protected _disk: {
        subscription: FbEmitterEventSubscription;
    };

    public constructor(args: iEventSubscriptionArgs) {
        this._disk.subscription = InternalStream.createEventSubscription(args);
    }

    public remove(): void {
        return this._disk.subscription.remove();
    }
}

export { iDispatchArgs };
export { iEventDispatchArgs };
export { iSubscriptionArgs };
export { iEventSubscriptionArgs };
export { iMessage };
export { iSubscription };
export { InternalStream };
export { Message };
export { Event };
export { Subscription };
export { EventSubscription };