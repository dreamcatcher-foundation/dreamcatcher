import {_emitter0, _emitter1} from "./_Emitter.ts";

export function post<Item, Response>({
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