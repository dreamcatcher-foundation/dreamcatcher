import {EventEmitter, EventSubscription} from "fbemitter";
import {UniqueTag} from "./UniqueTag.ts";

const _emitter0: EventEmitter = new EventEmitter();
const _emitter1: EventEmitter = new EventEmitter();

export function post<Item>(tag: UniqueTag, message: string, item?: Item): boolean {
    let signature: string = "";
    signature += tag;
    signature += "|";
    signature += message;
    _emitter0.emit(signature, item);
    return true;
}

export async function postAndWaitForResponse<Item, Response>(tag: UniqueTag, message: string, timeout: bigint, item?: Item): Promise<Response | undefined> {
    let signature: string = "";
    signature += tag;
    signature += "|";
    signature += message;
    return new Promise(function(resolve, reject) {
        let success: boolean = false;
        _emitter1.once(signature, function(response?: Response) {
            success = true;
            resolve(response);
        });
        _emitter0.emit(signature, item);
        setTimeout(() => !success && reject(undefined), Number(timeout));
    });
}

export function once<Item, Response>(tag: UniqueTag, message: string, hook: (item?: Item) => Response): EventSubscription {
    let signature: string = "";
    signature += tag;
    signature += "|";
    signature += message;
    return _emitter0.once(signature, function(item?: Item) {
        let response: Response = hook(item);
        _emitter1.emit(signature, response);
    });
}

export function hook<Item, Response>(tag: UniqueTag, message: string, hook: (item?: Item) => Response): EventSubscription {
    let signature: string = "";
    signature += tag;
    signature += "|";
    signature += message;
    return _emitter0.addListener(signature, function(item?: Item) {
        let response: Response = hook(item);
        _emitter1.emit(signature, response);
    });
}