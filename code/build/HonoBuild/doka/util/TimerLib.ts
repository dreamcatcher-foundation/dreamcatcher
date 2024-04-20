export async function sleep(ms: bigint): Promise<undefined> {
    const msNumber: number = Number(ms);
    return new Promise(resolve => setTimeout(resolve, msNumber));
}