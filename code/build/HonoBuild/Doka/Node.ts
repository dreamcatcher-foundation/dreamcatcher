import uniqueString from "unique-string";
import {EventEmitter, EventSubscription} from "fbemitter";

const _emitter0: EventEmitter = new EventEmitter();
const _emitter1: EventEmitter = new EventEmitter();

export type UniqueTag = string & {__type: "UniqueTag"};

export function uniqueTag() {
    
}



export function post<Item, Response>({
    _tag,
    _message,
    _item,
    _timeout,
    ff}: {
        _tag: UniqueTag;
        _message?: string;
        _item?: Item;
        _timeout?: bigint;
        ff: string}) {
    let _signature: string = "";
    _signature += _tag;
    _signature += "|";
    _signature += _message;
    return new Promise(function(resolve, reject) {
        let _success: boolean = false;
        _emitter1.once(_signature, 
            function(response?: Response) {
                _success = true;
                resolve(response ?? null);
            }
        );
        _emitter0.emit(_signature, _item);
        setTimeout(() => !_success && reject(undefined), Number(_timeout ?? 1000n));
    });
}


class Hook {

}

export function Hook<Item, Response>({
    _tag,
    _message,
    _once,
    _hook}: {
        _tag: UniqueTag;
        _message?: string;
        _once?: boolean;
        _hook: (item?: Item) => Response;}) {
    let _sub: EventSubscription;
    let _signature: string = "";
    _signature += _tag;
    _signature += "|";
    _signature += _message;
    let _instance = {
        remove
    };

    (function() {
        if (_once) {
            _sub = _emitter0.once(_signature,
                function(item?: Item) {
                    let _response: Response = _hook(item);
                    _emitter1.emit(_signature, _response);
                }
            );
        }
        _sub = _emitter0.addListener(_signature,
            function(item?: Item) {
                let _response: Response = _hook(item);
                _emitter1.emit(_signature, _response);
            }
        );
    })();

    function remove(): void {
        _sub.remove();
    }

    return _instance;
}




class _uniqueTag {
    private constructor() {}

    private static _used: string[] = [];

    public static get(): UniqueTag {
        const {_used} = this;
        let isUniqueString: boolean = false;
        let result: string = "";
        while(!isUniqueString) {
            let string: string = uniqueString();
            let sixHexString: string = string.slice(0, 4);
            let resultString: string = "";
            resultString += "0";
            resultString += "x";
            resultString += sixHexString;
            let hasTag: boolean = !_used.includes(resultString);
            if (!hasTag) {
                _used.push(resultString);
                result = resultString;
                isUniqueString = true;
            }
        }
        this._used = _used;
        return result as UniqueTag;
    }
}

let _uniqueTags = (function() {
    let used_: string[] = [];
    let instance_: {
        get: typeof get;
    };

    function get(): UniqueTag {
        let isNotUniqueString: boolean = true;
        let result: string = "";
        while(isNotUniqueString) {
            let string: string = uniqueString();
            let sixHexString: string = string.slice(0, 4);
            let resultString: string = "";
            resultString += "0";
            resultString += "x";
            resultString += sixHexString;
            let isUniqueString: boolean = !used_.includes(resultString);
            if (isUniqueString) {
                used_.push(resultString);
                result = resultString;
                isNotUniqueString = false;
            }
        }
        return result as UniqueTag;
    }

    return function() {
        if (!instance_) {
            return instance_ = {
                get
            }
        }
        return instance_;
    }
})();



type Node = ReturnType<typeof Node>;

export function Node() {
    let _tag: UniqueTag = _uniqueTag().get();
    let _instance = {
        tag,
        post,
        Hook
    };

    function tag(): UniqueTag {
        return _tag;
    }

    function post<Item, Response>({
        toNode,
        message,
        item,
        timeout}: {
            toNode: Node;
            message?: string;
            item?: Item;
            timeout?: bigint;}): Promise<Response | null> {
        let signature: string = "";
        signature += toNode.tag();
        signature += "|";
        signature += message ?? "";
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
        _message,
        _hook,
        _once}: {
            _message?: string;
            _hook: (item?: Item) => Response;
            _once?: boolean;}) {
        let _signature: string = "";
        _signature += tag();
        _signature += "|";
        _signature += _message ?? "";
        if (_once) {
            return _emitter0.once(_signature, function(item?: Item) {
                let response: Response = _hook(item);
                _emitter1.emit(_signature, response);
            });
        }
        return _emitter0.addListener(_signature, function(item?: Item) {
            let response: Response = _hook(item);
            _emitter1.emit(_signature, response);
        });
    }

    function Queue<QueueableItem>({
        message,
        once}: {
            message?: string;
            once?: boolean;}) {
        let _queue: 
    }

    return _instance;
}