export async function sleep(ms: bigint): Promise<null> {
    const msAsNum: number = Number(ms);
    return new Promise(resolve => setTimeout(resolve, msAsNum));
}

export function busySleep(ms: bigint): null {
    const timestamp: bigint = BigInt(new Date().getTime());
    while(BigInt(new Date().getTime()) < (timestamp + ms));
    return null;
}