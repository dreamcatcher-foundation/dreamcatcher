import type { EventSubscription } from "@HarukaToolkitBundle";
import { EventEmitter } from "@HarukaToolkitBundle";

interface IStream {
    dispatchCommand({
        toNodeName,
        commandName,
        timeout,
        item
    }: {
        toNodeName?: string;
        commandName?: string;
        timeout?: bigint;
        item?: unknown;
    }): Promise<unknown>;
    dispatchEvent({
        fromNodeName,
        eventName,
        item
    }: {
        fromNodeName?: string;
        eventName?: string;
        item?: unknown;
    }): void;
    createCommand({
        atNodeName,
        commandName,
        hook
    }: {
        atNodeName?: string;
        commandName?: string;
        hook(item?: unknown): unknown;
        once?: boolean;
    }): EventSubscription;
    createReaction({
        fromNodeName,
        eventName,
        hook,
        once
    }: {
        fromNodeName?: string;
        eventName?: string;
        hook(item?: unknown): void;
        once?: boolean;
    }): EventSubscription;
}

const stream: () => IStream = (function(): () => IStream {
    let self: IStream;
    let _eventEmitterMap0: Map<string, EventEmitter | undefined>;
    let _eventEmitterMap1: Map<string, EventEmitter | undefined>;

    (function(): void {
        _eventEmitterMap0 = new Map();
        _eventEmitterMap1 = new Map();
    })();

    async function dispatchCommand({
        toNodeName="",
        commandName="",
        timeout=0n,
        item=undefined
    }: {
        toNodeName?: string;
        commandName?: string;
        timeout?: bigint;
        item?: unknown
    }): Promise<unknown> {
        return new Promise(resolve => {
            let success: boolean = false;
            let responseSubscription: EventSubscription = _eventEmitter1({nodeName: toNodeName}).once(commandName, function(response: unknown) {
                if (!success) {
                    success = true;
                    resolve(response);
                    return;
                }
                return;
            });
            _eventEmitter0({nodeName: toNodeName}).emit(commandName, item);
            setTimeout(function() {
                if (!success) {
                    responseSubscription.remove();
                    resolve(undefined);
                }
            }, Number(timeout));
            return;
        });
    }

    function dispatchEvent({
        fromNodeName="",
        eventName="",
        item=undefined
    }: {
        fromNodeName?: string;
        eventName?: string;
        item?: unknown;
    }): void {
        return _eventEmitter0({nodeName: fromNodeName}).emit(eventName, item);
    }

    function createCommand({
        atNodeName="",
        commandName="",
        hook,
        once=false
    }: {
        atNodeName?: string;
        commandName?: string;
        hook(item?: unknown): unknown;
        once?: boolean;
    }): EventSubscription {
        if (once) {
            return _eventEmitter0({nodeName: atNodeName}).once(commandName, function(item?: unknown) {
                return _eventEmitter1({nodeName: atNodeName}).emit(commandName, hook(item));
            });
        }
        return _eventEmitter0({nodeName: atNodeName}).addListener(commandName, function(item?: unknown) {
            return _eventEmitter1({nodeName: atNodeName}).emit(commandName, hook(item));
        });
    }

    function createReaction({
        fromNodeName="",
        eventName="",
        hook,
        once=false
    }: {
        fromNodeName?: string;
        eventName?: string;
        hook(item?: unknown): void;
        once?: boolean;
    }): EventSubscription {
        if (once) {
            return _eventEmitter0({nodeName: fromNodeName}).once(eventName, hook);
        }
        return _eventEmitter0({nodeName: fromNodeName}).addListener(eventName, hook);
    }

    function _eventEmitter0({nodeName}: {nodeName: string}): EventEmitter {
        if (!_eventEmitterMap0.get(nodeName)) {
            return _eventEmitterMap0
                .set(nodeName, new EventEmitter())
                .get(nodeName)!;
        }
        return _eventEmitterMap0.get(nodeName)!;
    }

    function _eventEmitter1({nodeName}: {nodeName: string}): EventEmitter {
        if (!_eventEmitterMap1.get(nodeName)) {
            return _eventEmitterMap1
                .set(nodeName, new EventEmitter())
                .get(nodeName)!;
        }
        return _eventEmitterMap1.get(nodeName)!;
    }

    return function(): IStream {
        if (!self) {
            return self = {
                dispatchCommand,
                dispatchEvent,
                createCommand,
                createReaction
            };
        }
        return self;
    }
})();

export type { IStream };
export { stream };