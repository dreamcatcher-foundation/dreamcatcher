import { ethers as Ethers } from "ethers";
import * as TsResult from "ts-results";

function EthereumVirtualMachine({ signer }: { signer: Ethers.Wallet; }) {
    async function signerAddress(): Promise<string> {
        return await signer.getAddress();
    }

    async function generateNonce(): Promise<number> {
        return await signer.getNonce();
    }

    async function query({
        to,
        methodSignature,
        methodName,
        methodArgs=[]}: {
            to: string;
            methodSignature: string;
            methodName: string;
            methodArgs?: unknown[];
    }): Promise<TsResult.Result<unknown, unknown>> {
        try {
            return TsResult.Ok<unknown>(await new Ethers.Contract(to, [methodSignature], this._signer.provider).getFunction(methodName)(...methodArgs));
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    
}