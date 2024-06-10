import { type IEventBus } from "./IEventBus.ts";
import { EventEmitter as FbEventEmitter } from "fbemitter";

export const eventBus: () => IEventBus = (function(): () => IEventBus {
    const _questionEventEmitters: Map<string, undefined | FbEventEmitter> = new Map();
    const _responseEventEmitters: Map<string, undefined | FbEventEmitter> = new Map();
    let _instance: IEventBus;

    function questionEventEmitterOf(node: string): FbEventEmitter {
        if (!_questionEventEmitters.get(node)) {
            return _questionEventEmitters
                .set(node, new FbEventEmitter())
                .get(node)!;
        }
        return _questionEventEmitters.get(node)!;
    }

    function responseEventEmitterOf(node: string): FbEventEmitter {
        if (!_responseEventEmitters.get(node)) {
            return _responseEventEmitters
                .set(node, new FbEventEmitter())
                .get(node)!;
        }
        return _responseEventEmitters.get(node)!;
    }

    return function() {
        if (!_instance) {
            return _instance = { questionEventEmitterOf, responseEventEmitterOf };
        }
        return _instance;
    }
})();