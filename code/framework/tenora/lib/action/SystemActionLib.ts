import * as ChildProcess from "child_process";

export function execute(command: string): Buffer {
    return ChildProcess.execSync(command);
}