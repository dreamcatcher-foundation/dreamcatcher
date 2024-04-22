import {exec} from "child_process";

export function runCommand(string: string): null {
    exec(string);
    return null;
}