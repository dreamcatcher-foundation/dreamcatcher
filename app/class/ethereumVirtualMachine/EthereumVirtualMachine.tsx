import { type IEthereumVirtualMachine } from "./IEthereumVirtualMachine.ts";
import * as TsResult from "ts-results";
import * as Ether from "ethers";

const evm = (function() {
    let currentProvider_: Ether.BrowserProvider;
    let i_: IEthereumVirtualMachine;

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

    }

    async function provider_(): Promise<TsResult.Result<Ether.BrowserProvider, unknown>> {
        if (!window) {
            return TsResult.Err<string>("WindowNotAvailable");
        }
        if (!(window as any).ethereum) {
            return TsResult.Err<string>("EthereumNotAvailable");
        }
        currentProvider_ = new Ether.BrowserProvider((window as any).ethereum);
        try {
            const accounts: string[] = await currentProvider_.send("eth_accounts", []);
            if (accounts.length > 0) {
                return TsResult.Ok<Ether.BrowserProvider>(currentProvider_);
            }
            else {
                await currentProvider_.send("eth_requestAccounts", []);
                return TsResult.Ok<Ether.BrowserProvider>(currentProvider_);
            }
        }
        catch (error: unknown) {
            return TsResult.Err<unknown>(error);
        }
    }

    async function signer_(): Promise<TsResult.Option<Ether.JsonRpcSigner>> {
        if ((await provider_()).err) {
            return TsResult.None;
        }
        return TsResult.Some<Ether.JsonRpcSigner>(await (await provider_()).unwrap().getSigner());
    }

    async function signerAddress_(): Promise<TsResult.Option<string>> {
        if ((await signer_()).none) {
            return TsResult.None;
        }
        return TsResult.Some<string>(await (await signer_()).unwrap().getAddress());
    }

    async function generateNonce_(): Promise<TsResult.Option<number>> {
        if ((await signer_()).none) {
            return TsResult.None;
        }
        return TsResult.Some<number>(await (await signer_()).unwrap().getNonce());
    }

    return function() {
        if (!i_) {
            return i_ = { query };
        }
        return i_
    }
})();