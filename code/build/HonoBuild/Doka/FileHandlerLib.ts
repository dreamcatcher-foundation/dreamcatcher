import type {Maybe} from "./ErrorHandlerLib.ts";
import {wrap} from "./ErrorHandlerLib.ts";
import {readFileSync, writeFileSync} from "fs";

function read(path: string): string {
    return readFileSync(path, "utf8");
}

function safeRead(path: string): Maybe<string> {
    return wrap<string>(function() {
        return readFileSync(path, "utf8");
    });
}

function write(path: string, item?: string): null {
    writeFileSync(path, item ?? "");
    return null;
}