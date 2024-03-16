import * as TimeLib from "../TimeLib.ts";

export async function sleep(ms: bigint): Promise<void> {
    new Promise(resolve=>setTimeout(resolve, Number(ms)));
    return;
}