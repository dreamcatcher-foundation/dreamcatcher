import { ethers as Ethers } from "ethers";


class Contract {
    protected _rpcUrl: string;
    protected _address: string;
    protected _abi: string[];

    public constructor() {}

    public rpcUrl(): string {
        return this._rpcUrl;
    }

    public address(): string {
        return this._address;
    }

    public abi(): string[] {
        return this._abi;
    }


    public attachSolFile(): void {}

    public bindAbi(abi: string[]) {
        return this;
    }

    public call(): Promise<Ethers.TransactionReceipt | null> {

    }

    public async query(methodName: string, ...methodArgs: unknown[]): Promise<unknown> {
        return await (new Ethers.Contract(
            this.address(),
            this.abi(),
            new Ethers.JsonRpcProvider(
                this.rpcUrl()
            )
        ))
            .getFunction(methodName)(...methodArgs);
    }
}

new Contract()
    .bindAbi([
        "function doSomethign()",
        ""
    ])
    .attachSolFile()
    