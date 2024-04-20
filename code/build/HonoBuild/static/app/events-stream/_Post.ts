import {EventEmitter} from "fbemitter";
import {internalRequestStream} from "./_InternalRequestStream.ts";
import {internalResponseStream} from "./_InternalResponseStream.ts";
import {PostArgs} from "./_PostArgs.ts";

export async function post<Response>(args: PostArgs): Promise<Response | null> {
    const {toSocket, message, data, timeout} = args;
    const reqStream: EventEmitter = internalRequestStream;
    const resStream: EventEmitter = internalResponseStream;
    const signature: string = `${message}|${toSocket}`;
    const timeoutAsNum: number = Number(timeout ?? 1000);
    let success: boolean = false;
    
    return new Promise(function(resolve, reject) {
        resStream.once(signature, (response: Response) => resolve(response));
        reqStream.emit(signature, data);

        setTimeout(function() {
            if (!success) reject(null);
        }, timeoutAsNum);
    });
}