import { now } from "./lib/TimeLib.ts";
import { sleep } from "./lib/action/TimerActionLib.ts";
import { execute } from "./lib/action/SystemActionLib.ts";
import { read, write, lookfor } from "./lib/action/FileSystemActionLib.ts";
import { require } from "./lib/action/FaultHandlingActionLib.ts";

export interface Tenora {
    now: typeof now;
    sleep: typeof sleep;
    execute: typeof execute;
    read: typeof read;
    write: typeof write;
    require: typeof require;
    lookfor: typeof lookfor;
}

export const tenora = (function() {
    let instance: Tenora

    return function() {
        if (!instance) {
            return instance = {
                now,
                sleep,
                execute,
                read,
                write,
                require,
                lookfor
            }
        }
        return instance;
    }
})();