export default class Timer {
    public static sleepSync(ms: bigint): typeof Timer {
        const timestamp: bigint = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < (timestamp + ms));
        return Timer;
    }

    public static async sleep(ms: bigint): Promise<typeof Timer> {
        const msAsNum: number = Number(ms);
        return new Promise(resolve => setTimeout(resolve, msAsNum, Timer));
    }
}