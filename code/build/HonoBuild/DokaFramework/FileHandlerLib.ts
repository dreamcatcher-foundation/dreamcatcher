import type {Maybe} from "./ErrorHandlerLib.ts";
import {wrap} from "./ErrorHandlerLib.ts";
import {readFileSync, writeFileSync} from "fs";

export function read(path: string): string {
    return readFileSync(path, "utf8");
}

export function safeRead(path: string): Maybe<string> {
    return wrap<string>(function() {
        return readFileSync(path, "utf8");
    });
}

export function write(path: string, item?: string): null {
    writeFileSync(path, item ?? "");
    return null;
}

export function safeWrite(path: string, item?: string): Maybe<null> {
    return wrap<null>(function() {
        writeFileSync(path, item ?? "");
        return null;
    });
}