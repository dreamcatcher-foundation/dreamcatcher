

class RpcUrl {
    public constructor(private readonly _rpcUrl) {}

    public get(): string {
        return this._rpcUrl;
    }
}


const x: Contract = {
    name: ""
}