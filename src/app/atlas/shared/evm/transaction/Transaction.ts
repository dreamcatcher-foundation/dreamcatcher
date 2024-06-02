import { ethers as Ethers } from "ethers";
import { Url } from "../../web/Url.ts";
import { Secret } from "../../os/Secret.ts";
import { AbiCase } from "../../case/AbiCase.ts";

class Transaction {
    public constructor(
        private readonly _state: {
            rpcUrl: string;
            contract: {
                address: string;
                method: string;
                args: unknown[];
                abi: object[] | string[];
            };
            signerKey: string | Secret;
        }
    ) {}

    public async response(): Promise<Ethers.ContractTransactionResponse> {
        return await (new Ethers.Contract(
            this._state.contract.address,
            this._state.contract.abi,
            new Ethers.Wallet(
                this._state.signerKey,
                new JsonRpcProvider(
                    this._state.rpcUrl
                )
            )
        ))
    }
}