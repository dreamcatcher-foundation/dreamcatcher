import { type EventSubscription } from "fbemitter";
import { EventEmitter } from "fbemitter";

class Stream {
    private constructor() {}
    private static _eventEmitterMap0: Map<string, EventEmitter | undefined> = new Map();
    private static _eventEmitterMap1: Map<string, EventEmitter | undefined> = new Map();
    
    public static async dispatch({
        toNode = "",
        command = "",
        timeout = 0n,
        item = undefined
    }: {
        toNode?: string;
        command?: string;
        timeout?: bigint;
        item?: unknown;
    }): Promise<unknown> {
        return new Promise(resolve => {
            let success: boolean = false;
            let responseSubscription: EventSubscription = this._eventEmitter1(toNode).once(command, (response: unknown) => {
                if (!success) {
                    success = true;
                    resolve(response);
                    return;
                }
                return;
            });
            this._eventEmitter0(toNode).emit(command, item);
            setTimeout(() => {
                if (!success) {
                    responseSubscription.remove();
                    resolve(undefined);
                }
            }, Number(timeout));
            return;
        });
    }

    public static dispatchEvent({
        fromNode = "",
        event = "",
        item = undefined
    }: {
        fromNode?: string;
        event?: string;
        item?: unknown;
    }): void {
        return this._eventEmitter0(fromNode).emit(event, item);
    }

    public static createSubscription({
        atNode = "",
        command = "",
        hook,
        once = false
    }: {
        atNode?: string;
        command?: string;
        hook(item?: unknown): unknown;
        once?: boolean;
    }): EventSubscription {
        if (once) {
            return this._eventEmitter0(atNode).once(command, (item?: unknown) => this._eventEmitter1(atNode).emit(command, hook(item)));
        }
        return this._eventEmitter0(atNode).addListener(command, (item?: unknown) => this._eventEmitter1(atNode).emit(command, hook(item)));
    }

    public static createEventSubscription({
        fromNode = "",
        event = "",
        hook,
        once = false
    }: {
        fromNode?: string;
        event?: string;
        hook(item?: unknown): void;
        once?: boolean;
    }): EventSubscription {
        if (once) {
            return this._eventEmitter0(fromNode).once(event, hook);
        }
        return this._eventEmitter0(fromNode).addListener(event, hook);
    }

    private static _eventEmitter0(node: string): EventEmitter {
        if (!this._eventEmitterMap0.get(node)) {
            return this._eventEmitterMap0
                .set(node, new EventEmitter())
                .get(node)!;
        }
        return this._eventEmitterMap0.get(node)!;
    }

    private static _eventEmitter1(node: string): EventEmitter {
        if (!this._eventEmitterMap1.get(node)) {
            return this._eventEmitterMap1
                .set(node, new EventEmitter())
                .get(node)!;
        }
        return this._eventEmitterMap1.get(node)!;
    }
}

export { Stream };