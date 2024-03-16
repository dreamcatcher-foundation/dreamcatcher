import * as TimeLib from "./lib/TimeLib.ts";
import * as TimerActionLib from "./lib/action/TimerActionLib.ts";
import * as SystemActionLib from "./lib/action/SystemActionLib.ts";
import * as FileActionLib from "./lib/action/FileActionLib.ts";
import * as FaultHandlingActionLib from "./lib/action/FaultHandlingActionLib.ts";

const tenora = (function() {
    let instance;

    return function() {
        if (!instance) {
            return instance = {
                TimeLib,
                TimerActionLib,
                SystemActionLib,
                FileActionLib,
                FaultHandlingActionLib
            }
        }
        return instance;
    }
})();

console.log(tenora().now());