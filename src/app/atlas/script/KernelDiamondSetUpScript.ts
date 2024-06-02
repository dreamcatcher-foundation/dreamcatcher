import { TransactionResponse } from "ethers";
import { Wallet as EthersSigner } from "ethers";
import { JsonRpcProvider as EthersNode } from "ethers";
import { Contract as EthersContract } from "ethers";

class MethodCallTransaction {
    private readonly _from: string;
    private readonly _to: string;
    private readonly _privateKey: string;
    private readonly _gas: bigint;
    private readonly _gasPrice: bigint;
    private readonly _value: bigint;
    private readonly _rpcUrl: string;
    private readonly _signature: string;
    private readonly _methodName: string;
    private readonly _methodArgs: any[];

    public constructor(args: {
        from: string;
        to: string;
        privateKey: string;
        gas: bigint;
        gasPrice: bigint;
        value: bigint;
        rpcUrl: string;
        signature: string;
        methodName: string;
        methodArgs: any[];
    }) {
        this._from = args.from;
        this._to = args.to;
        this._privateKey = args.privateKey;
        this._gas = args.gas;
        this._gasPrice = args.gasPrice;
        this._value = args.value;
        this._rpcUrl = args.rpcUrl;
        this._signature = args.signature;
        this._methodName = args.methodName;
        this._methodArgs = args.methodArgs;
    }

    public async post(): Promise<TransactionResponse> {
        let node: EthersNode = new EthersNode(this._rpcUrl);
        let signer: EthersSigner = new EthersSigner(this._privateKey, node);
        let abi: string[] = [this._signature];
        let contract: EthersContract = new EthersContract(this._to, abi, signer);
        let payload: string = contract.interface.encodeFunctionData(this._methodName, this._methodArgs);
        let transaction = {
            from: this._from,
            to: this._to,
            gasLimit: this._gas,
            gasPrice: this._gasPrice,
            value: this._value,
            data: payload
        } as const;
        return await signer.sendTransaction(transaction);
    }
}

class DeploymentTransaction {
    private readonly _signer:
        | string
        | Secret;
    


    private readonly _from: string;
    private readonly _gas: bigint;
    private readonly _gasPrice: bigint;
    private readonly _value: bigint;
    private readonly _ethersNode: EthersNode;
    private readonly _ethersSigner: EthersSigner;
    private readonly _abi: 
        | object[] 
        | string[] 
        | string 
        | SolFile
        | Url
        | JsonFile
        | File;
    private readonly _bytecode:
        | string
        | SolFile
        | Url
        | JsonFile
        | File;
    private readonly _constructorPayload: unknown[];

    public constructor(payload: {
        from: string;
        gas: bigint;
        gasPrice: bigint;
        value: bigint;
        privateKey: string;
        rpcUrl: string;
        abi:
            | object[] 
            | string[] 
            | string 
            | SolFile
            | Url
            | JsonFile
            | File;
        bytecode:
            | string
            | SolFile
            | Url
            | JsonFile
            | File;
        constructorPayload: unknown[];
    }) {

    }
}

class Transaction {
    private readonly _from: string;
    private readonly _to: string;
    private readonly _gas: bigint;
    private readonly _gasPrice: bigint;
    private readonly _value: bigint;
    private readonly _ethersNode: EthersNode;
    private readonly _ethersSigner: EthersSigner;
    private readonly _abi: string;
    private readonly _methodName: string;
    private readonly _methodArgs: any[];

    public constructor(args: {
        from: string;
        to: string;
        gas: bigint;
        gasPrice: bigint;
        value: bigint;
        privateKey: string;
        url: string;
        abi: string;
        methodName: string;
        methodArgs: any[];
    }) {
        this._from = args.from;
        this._to = args.to;
        this._gas = args.gas;
        this._gasPrice = args.gasPrice;
        this._value = args.value;
        this._ethersNode = new EthersNode(args.url);
        this._ethersSigner = new EthersSigner(args.privateKey, this._ethersNode);
        this._abi = args.abi;
        this._methodName = args.methodName;
        this._methodArgs = args.methodArgs;
    }

    public async post() {
        let ethersContract: EthersContract = new EthersContract(this._to, [this._abi], this._ethersSigner);
        let transactionPayload = ethersContract.interface.encodeFunctionData(this._methodName, this._methodArgs);
        let transaction = {
            from: this._from,
            to: this._to,
            gasLimit: this._gas,
            gasPrice: this._gasPrice,
            value: this._value,
            data: transactionPayload
        };
        return await this._ethersSigner.sendTransaction(transaction);
    }
}

class KernelDiamondSetUpScript {
    public static async run() {


        new Transaction({
            from: "",
            to: "",
            gas: 21000n,
            gasPrice: 2000000n,
            "value": 0n,
            "url": "",
            "privateKey": "",
            "abi": "function ",
            "methodName": "",
            "methodArgs": []
        })
            .post();
    }
}

KernelDiamondSetUpScript.run();