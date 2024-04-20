import {EventEmitter} from "fbemitter";
import {internalRequestStream} from "./_InternalRequestStream.ts";
import {internalResponseStream} from "./_InternalResponseStream.ts";
import {OnArgs} from "./_OnArgs.ts";

export function on(args: OnArgs) {
    const {thisSocket, message, handler, once} = args;
    const reqStream: EventEmitter = internalRequestStream;
    const resStream: EventEmitter = internalResponseStream;
    const signature: string = `${message}|${thisSocket}`;

    if (once) return reqStream.once(signature, function(data?: any) {
        const response: any = handler(data);

        resStream.emit(signature, response);
    });

    return reqStream.addListener(signature, function(data?: any) {
        const response: any = handler(data);

        resStream.emit(signature, response);
    });
}