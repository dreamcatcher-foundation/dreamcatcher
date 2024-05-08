import {type EventSubscription, EventEmitter} from "fbemitter";

interface Stream {
    emitters0: (nodeKey: string) => EventEmitter;
    emitters1: (nodeKey: string) => EventEmitter;
    post: (fromNodeKey: string, eventKey: string, ...items: any[]) => Stream;
    call: (toNodeKey: string, methodKey: string, timeout?: bigint, ...items: any[]) => Promise<any>;
    hook: (atNodeKey: string, methodKey: string, hook: (...items: any[]) => any) => EventSubscription;
    once: (atNodeKey: string, methodKey: string, hook: (...items: any[]) => any) => EventSubscription;
    on: (fromNodeKey: string, eventKey: string, hook: (...items: any[]) => any, once?: boolean) => EventSubscription;
}

const stream = (function() {
    let instance: Stream;
    const _emitters0: Map<string, EventEmitter | undefined> = new Map();
    const _emitters1: Map<string, EventEmitter | undefined> = new Map();
    
    function emitters0(nodeKey: string): EventEmitter {
        if (!_emitters0.get(nodeKey)) {
            return _emitters0
                .set(nodeKey, new EventEmitter())
                .get(nodeKey)!;
        }
        return _emitters0.get(nodeKey)!;
    }

    function emitters1(nodeKey: string): EventEmitter {
        if (!_emitters1.get(nodeKey)) {
            return _emitters1
                .set(nodeKey, new EventEmitter())
                .get(nodeKey)!;
        }
        return _emitters1.get(nodeKey)!;
    }

    function post(fromNodeKey: string, eventKey: string, ...items: any[]): Stream {
        emitters0(fromNodeKey).emit(eventKey, ...items);
        return instance;
    }

    async function call(toNodeKey: string, methodKey: string, timeout?: bigint, ...items: any[]): Promise<any> {
        return new Promise(function(resolve, reject) {
            let success: boolean = false;
            emitters1(toNodeKey).once(methodKey, (response: any) => resolve(response));
            emitters0(toNodeKey).emit(methodKey, ...items);
            setTimeout(function() {
                if (!success) {
                    reject("TIMED_OUT");
                }
                return;
            }, Number(timeout));
            return;
        });
    }

    function hook(atNodeKey: string, methodKey: string, hook: (...items: any[]) => any): EventSubscription {
        return emitters0(atNodeKey).addListener(methodKey, function(...items: any[]) {
            emitters1(atNodeKey).emit(methodKey, hook(...items));
            return;
        });
    }

    function once(atNodeKey: string, methodKey: string, hook: (...items: any[]) => any): EventSubscription {
        return emitters0(atNodeKey).addListener(methodKey, function(...items: any[]) {
            return emitters1(atNodeKey).emit(methodKey, hook(...items));
        });
    }

    function on(fromNodeKey: string, eventKey: string, hook: (...items: any[]) => any, once?: boolean): EventSubscription {
        if (once) {
            return emitters0(fromNodeKey).once(eventKey, hook);
        }
        return emitters0(fromNodeKey).addListener(eventKey, hook);
    }

    return function() {
        if (!instance) {
            instance = {
                emitters0,
                emitters1,
                post,
                call,
                hook,
                once,
                on
            }
        }
        return instance;
    }
})();

export {type EventSubscription, type Stream, stream};