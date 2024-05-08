export default class Timer {
    public static sleepSync(ms: bigint): void {
        const timestamp: bigint = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < (timestamp + ms));
    }

    public static async sleep(ms: bigint): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, Number(ms)));
    }
}

