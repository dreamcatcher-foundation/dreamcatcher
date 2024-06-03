import { type EventSubscription as FbEventSubscription } from "fbemitter";
import { EventEmitter } from "fbemitter";

export namespace EventBus {
    export abstract class IMessageConstructorArgs {
        public abstract at?: string;
        public abstract message?: string;
        public abstract timeout?: bigint;
        public abstract item?: unknown;
    }
    
    export abstract class IMessage {
        public abstract response(): Promise<unknown>;
    }
    
    export abstract class IEventConstructorArgs {
        public abstract from?: string;
        public abstract event?: string;
        public abstract item?: unknown;
    }
    
    export abstract class IMessageSubscriptionConstructorArgs {
        public abstract at?: string;
        public abstract message?: string;
        public abstract handler(item?: unknown): unknown;
        public abstract once?: boolean;
    }
    
    export abstract class IMessageSubscription {
        public abstract remove(): void;
    }

    export abstract class IEventSubscriptionConstructorArgs {
        public abstract from?: string;
        public abstract event?: string;
        public abstract handler(item?: unknown): void;
        public abstract once?: boolean;
    }

    export abstract class IEventSubscription {
        public abstract remove(): void;
    }

    const _questionEventEmitters: Map<string, undefined | EventEmitter> = new Map();
    const _responseEventEmitters: Map<string, undefined | EventEmitter> = new Map();

    export class Message implements IMessage {
        protected _response: Promise<unknown>;

        public constructor(args: IMessageConstructorArgs) {
            this._response = new Promise(resolve => {
                let success: boolean = false;
                let subscription: FbEventSubscription = _responseEventEmitter(args.at ?? "anonymous").once(args.message ?? "", (response: unknown) => {
                    if (!success) {
                        success = true;
                        resolve(response);
                        return;
                    }
                    return;
                });
                _questionEventEmitter(args.at ?? "anonymous").emit(args.message ?? "", args.item);
                setTimeout(() => {
                    if (!success) {
                        subscription.remove();
                        resolve(undefined);
                        return;
                    }
                    return;
                }, Number(args.timeout ?? 0n));
                return;
            });
        }

        public async response(): Promise<unknown> {
            return await this._response;
        }
    }

    export class Event {
        public constructor(args: IEventConstructorArgs) {
            _questionEventEmitter(args.from ?? "anonymous").emit(args.event ?? "", args.item);
        }
    }

    export class MessageSubscription implements IMessageSubscription {
        protected _subscription: FbEventSubscription;

        public constructor(args: IMessageSubscriptionConstructorArgs) {
            this._subscription
                = !!args.once
                    ? _questionEventEmitter(args.at ?? "anonymous").once(args.message ?? "", (item?: unknown) => _responseEventEmitter(args.at ?? "anonymous").emit(args.message ?? "", args.handler(item)))
                    : _questionEventEmitter(args.at ?? "anonymous").addListener(args.message ?? "", (item?: unknown) => _responseEventEmitter(args.at ?? "anonymous").emit(args.message ?? "", args.handler(item)));
        }

        public remove(): void {
            return this._subscription.remove();
        }
    }

    export class EventSubscription implements IEventSubscription {
        protected _subscription: FbEventSubscription

        public constructor(args: IEventSubscriptionConstructorArgs) {
            this._subscription
                = !!args.once
                    ? _questionEventEmitter(args.from ?? "anonymous").once(args.event ?? "", args.handler)
                    : _questionEventEmitter(args.from ?? "anynymous").addListener(args.event ?? "", args.handler);
        }

        public remove(): void {
            return this._subscription.remove();
        }
    }

    function _questionEventEmitter(address: string): EventEmitter {
        if (!_questionEventEmitters.get(address)) {
            return _questionEventEmitters
                .set(address, new EventEmitter())
                .get(address)!;
        }
        return _questionEventEmitters.get(address)!;
    }

    function _responseEventEmitter(address: string): EventEmitter {
        if (!_responseEventEmitters.get(address)) {
            return _responseEventEmitters
                .set(address, new EventEmitter())
                .get(address)!;
        }
        return _responseEventEmitters.get(address)!;
    }
}