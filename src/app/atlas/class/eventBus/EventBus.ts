import { EventEmitter as FbEventEmitter } from "fbemitter";
import { EventSubscription as FbEventSubscription } from "fbemitter";

export namespace EventBus {
    export abstract class IMessageConstructorPayload {
        public abstract to?: string;
        public abstract message?: string;
        public abstract timeout?: bigint;
        public abstract item?: unknown;
    }

    export abstract class IMessage {
        public abstract response(): Promise<unknown>;
    }

    export abstract class IEventConstructorPayload {
        public abstract from?: string;
        public abstract event?: string;
        public abstract item?: unknown;
    }

    export abstract class IEventSubscriptionConstructorPayload {
        public abstract from?: string;
        public abstract event?: string;
        public abstract handler(item?: unknown): void;
        public abstract once?: boolean;
    }

    export abstract class IMessageSubscriptionConstructorPayload {
        public abstract at?: string;
        public abstract message?: string;
        public abstract handler(item?: unknown): unknown;
        public abstract once?: boolean;
    }

    export abstract class ISubscription {
        public abstract remove(): void;
    }

    class _State {
        private constructor() {}
        protected static _inner: {
            questionEventEmitters: Map<string, undefined | FbEventEmitter>;
            responseEventEmitters: Map<string, undefined | FbEventEmitter>;
        } = {
            questionEventEmitters: new Map(),
            responseEventEmitters: new Map()
        };
    
        public static questionEventEmitterOf(node: string): FbEventEmitter {
            if (!this._inner.questionEventEmitters.get(node)) {
                return this._inner.questionEventEmitters
                    .set(node, new FbEventEmitter())
                    .get(node)!;
            }
            return this._inner.questionEventEmitters.get(node)!;
        }
    
        public static responseEventEmitterOf(node: string): FbEventEmitter {
            if (!this._inner.questionEventEmitters.get(node)) {
                return this._inner.questionEventEmitters
                    .set(node, new FbEventEmitter())
                    .get(node)!;
            }
            return this._inner.questionEventEmitters.get(node)!;
        }
    }

    export class Message implements IMessage {
        protected _state: {response: Promise<unknown>};
    
        public constructor(payload: IMessageConstructorPayload) {
            this._state = {
                response: new Promise(resolve => {
                    let success: boolean = false;
                    let subscription: FbEventSubscription = _State.responseEventEmitterOf(payload.to ?? "anonymous").once(payload.message ?? "", (response: unknown) => {
                        if (!success) {
                            success = true;
                            resolve(response);
                            return;
                        }
                        return;
                    });
                    _State.questionEventEmitterOf(payload.to ?? "anonymous").emit(payload.message ?? "", payload.item);
                    setTimeout(() => {
                        if (!success) {
                            subscription.remove();
                            resolve(undefined);
                            return;
                        }
                        return;
                    }, Number(payload.timeout ?? 0n));
                    return;
                })
            };
        }
    
        public async response(): Promise<unknown> {
            return await this._state.response;
        }
    }

    export class Event {
        public constructor(payload: IEventConstructorPayload) {
            _State.questionEventEmitterOf(payload.from ?? "anonymous").emit(payload.event ?? "", payload.item);
        }
    }

    export class MessageSubscription implements ISubscription {
        protected _state: {
            subscription: FbEventSubscription;
        }

        public constructor(payload: IMessageSubscriptionConstructorPayload) {
            this._state = {
                subscription: !!payload.once
                    ? _State.questionEventEmitterOf(payload.at ?? "anonymous").once(payload.message ?? "", (item?: unknown) => _State.responseEventEmitterOf(payload.at ?? "anonymous").emit(payload.message ?? "", payload.handler(item)))
                    : _State.questionEventEmitterOf(payload.at ?? "anonymous").addListener(payload.message ?? "", (item?: unknown) => _State.responseEventEmitterOf(payload.at ?? "anonymous").emit(payload.message ?? "", payload.handler(item)))
            };
        }

        public remove(): void {
            return this._state.subscription.remove();
        }
    }

    export class EventSubscription implements ISubscription {
        protected _state: {
            subscription: FbEventSubscription;
        }

        public constructor(payload: IEventSubscriptionConstructorPayload) {
            this._state = {
                subscription: !!payload.once
                    ? _State.questionEventEmitterOf(payload.from ?? "anonymous").once(payload.event ?? "", payload.handler)
                    : _State.questionEventEmitterOf(payload.from ?? "anynymous").addListener(payload.event ?? "", payload.handler)
            };
        }

        public remove(): void {
            return this._state.subscription.remove();
        }
    }
}