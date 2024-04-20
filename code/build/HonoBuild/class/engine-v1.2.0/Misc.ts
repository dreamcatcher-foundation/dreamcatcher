export async function sleep(ms: bigint): Promise<undefined> {

    return new Promise(resolve => setTimeout(resolve, Number(ms)));
}