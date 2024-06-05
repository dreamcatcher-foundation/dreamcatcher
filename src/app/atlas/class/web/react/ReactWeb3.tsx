import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";

export namespace ReactWeb3 {
    export abstract class ITransaction {
        public abstract receipt(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>>;
    }

    export abstract class ITransactionConstructorPayload {
        public abstract to: string;
        public abstract methodSignature: string;
        public abstract methodName: string;
        public abstract methodArgs?: unknown[];
        public abstract chainId?: bigint;
    }

    export class Transaction implements ITransaction {
        public constructor(protected _payload: ITransactionConstructorPayload) {}

        public async receipt(): Promise<TsResult.Result<Ethers.TransactionReceipt | null, unknown>> {
            try {
                let metamask: unknown = (window as any).ethereum;
                if (!metamask) {
                    console.error("Metamask not installed, please install metamask??");
                    return new TsResult.Ok<null>(null);
                }
                let node: Ethers.BrowserProvider = new Ethers.BrowserProvider((metamask as any));
                let signer: Ethers.JsonRpcSigner = await node.getSigner();
                if (this._payload.chainId) {
                    if ((await node.getNetwork()).chainId !== this._payload.chainId) {
                        console.error("ReactWeb3::InvalidChainId");
                        return new TsResult.Ok<null>(null);;
                    }
                }
                let contract: Ethers.Contract = new Ethers.Contract(
                    this._payload.to, [
                        this._payload.methodSignature
                    ],
                    signer
                );
                return new TsResult.Ok<Ethers.TransactionReceipt | null>(await (await contract.getFunction(this._payload.methodName)(...this._payload.methodArgs ?? []) as Ethers.TransactionResponse).wait());
            }
            catch (error: unknown) {
                return new TsResult.Err<unknown>(error);
            }
        }
    }
}