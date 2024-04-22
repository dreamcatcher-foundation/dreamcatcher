import type {EventSubscription} from "fbemitter";
import {EventEmitter} from "fbemitter";

export * from "./_Lib.ts";
export * from "./_Hook.ts"
export * from "./_QueueableHook.ts";


export type Hook<Item, Response> = ReturnType<typeof stream.Hook<Item, Response>>;

const stream = (function() {
    const _emitter0: EventEmitter = new EventEmitter();
    const _emitter1: EventEmitter = new EventEmitter();

    function post<Item, Response>({
        tag,
        message,
        item,
        timeout}: {
            tag: string;
            message?: string;
            item?: Item;
            timeout?: bigint;}): Promise<Response | null> {
        let signature: string = "";
        signature += tag;
        signature += "|";
        signature += message;
        return new Promise(function(resolve, reject) {
            let success: boolean = false;
            _emitter1.once(signature, function(response?: Response) {
                success = true;
                resolve(response ?? null);
            });
            _emitter0.emit(signature, item);
            setTimeout(() => !success && reject(undefined), Number(timeout ?? 1000n));
        });
    }

    function Hook<Item, Response>({
        _tag,
        _message,
        _hook,
        _once}: {
            _tag: string;
            _message?: string;
            _hook: (item?: Item) => Response;
            _once?: boolean;}) {
        let _sub: EventSubscription;
        let _signature: string = "";
        _signature += _tag;
        _signature += "|";
        _signature += _message;

        (function() {
            if (_once) _sub = _emitter0.once(_signature, function(item?: Item) {
                let _response: Response = _hook(item);
                _emitter1.emit(_signature, _response);
            });
            _sub = _emitter0.addListener(_signature, function(item?: Item) {
                let _response: Response = _hook(item);
                _emitter1.emit(_signature, _response);
            });
        })();

        function remove(): void {
            _sub.remove();
        }

        function _instance() {
            return {
                remove
            };
        }

        return _instance();
    }

    function _instance() {
        return {
            post,
            Hook
        };
    }

    return _instance();
})();