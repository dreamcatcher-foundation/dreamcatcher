import {Secret, MissingSecretError} from "../os/Secret.ts";
import Path from "../os/path/Path.ts";
import Url from "../web/Url.ts";
import SolidityPath from "../os/path/SolidityPath.ts";

export class BadUrlResponseError extends Error {}
export class FailedFileReadError extends Error {}

function BytecodeAdaptor(
    _bytecodeish:
        | string
        | Secret
        | Path
        | Url
        | SolidityPath
): string {
    if (typeof _bytecodeish === "string") {
        return _bytecodeish;
    }
    else if (_bytecodeish instanceof Secret) {
        _bytecodeish.get()
    }
}

export default class BytecodeAdaptorr {
    public constructor(
        private readonly _bytecodeish:
            | string
            | Secret
            | Path
            | Url
            | SolidityPath) {}

    public async get(): 
        Promise<
            string 
            | MissingSecretError 
            | BadUrlResponseError
            | FailedFileReadError
            > {
        let {_bytecodeish} = this;
        if (_bytecodeish instanceof Secret) {
            let content: string | MissingSecretError = _bytecodeish.get();
            return content;
        }
        else if (_bytecodeish instanceof Path) {
            try {
                return _bytecodeish.content("utf8");
            }
            catch {
                return new FailedFileReadError();
            }
        }
        else if (_bytecodeish instanceof Url) {
            try {
                let response = await _bytecodeish.response();
                return response.data();
            }
            catch {
                return new BadUrlResponseError();
            }
        }
        else {
            return _bytecodeish;
        }
    }
}