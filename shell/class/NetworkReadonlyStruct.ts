export class NetworkReadonlyStruct {
    public constructor(
        public readonly id: string,
        public readonly rpcUrl: string,
        public readonly privateKeys: string[]
    ) {}
}