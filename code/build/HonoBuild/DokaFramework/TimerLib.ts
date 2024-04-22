export async function sleep(ms: bigint): Promise<null> {
    return new Promise(resolve => setTimeout(resolve, Number(ms)));
}

export function busySleep(ms: bigint): null {
    const timestamp: bigint = BigInt(new Date().getTime());
    while(BigInt(new Date().getTime()) < (timestamp + ms));
    return null;
}