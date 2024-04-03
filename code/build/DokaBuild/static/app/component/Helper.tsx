import {broadcast} from "./design/Remote";


export async function doStaggered(fns: Function[], cooldown: bigint, name?: string) {
    const fnLength = fns.length;
    let wait = 0n;
    for (let i = 0; i < fnLength; i++) {
        const fn = fns[i];
        const waitAsNum = Number(wait);
        await new Promise(resolve => {
            setTimeout(function() {
                fn();
                resolve(null);
            }, waitAsNum);
        });
        wait += cooldown;
    }
    const waitAsNum = Number(wait);
    if (!name) {
        return;
    }
    await new Promise(resolve => {
        setTimeout(function() {
            broadcast(`${name} transition done`);
            resolve(null);
        }, waitAsNum);
    });
    return;
}