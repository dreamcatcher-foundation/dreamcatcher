import type {EventSubscription} from "./_Emitter.ts";
import {_emitter0, _emitter1} from "./_Emitter.ts";

export type Hook<Item, Response> = ReturnType<typeof Hook<Item, Response>>;

export function Hook<Item, Response>({
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
    let _instance = {
        remove
    };

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

    return _instance;
}