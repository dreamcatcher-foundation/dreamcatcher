import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const utils = (function() {

});


export function $wrap<R>(operation: Function, ...args: any[]): R | Error {
    try {
        return operation(...args);
    } catch (reason: unknown) {
        return new Error(reason as string);
    }
}

export function $assert(statement: boolean, message?: string): void {
    if (!statement) {
        throw new Error(message ?? "");
    }
}

export function $execute(command: string): Buffer {
    return execSync(command);
}

export function $timestamp(): bigint {
    return BigInt(new Date().getTime());
}

export function $sleep(ms: bigint): void {
    while($timestamp() < $timestamp() + ms);
}

export function $read(path: string) {
    return readFileSync(path, "utf8");
}

export function $write(path: string, content: string) {
    return writeFileSync(path, content);
}