import { JsonRpcProvider, Wallet } from "ethers";
import { CompiledContractMaterialReadonlyStruct } from "./CompiledContractMaterialReadonlyStruct.ts";
import { LoaderReadonlyStruct } from "./LoaderReadonlyStruct.ts";
import { Compiler } from "./Compiler.ts";

class Loaded {
    private _compiler: Compiler;
    private _materials: Map<string, CompiledContractMaterialReadonlyStruct> = new Map();
    private _networks: Map<string, JsonRpcProvider> = new Map();
    private _accounts: Map<string, Wallet> = new Map();

    public constructor(loader: LoaderReadonlyStruct) {
        const compiler: Compiler = new Compiler(loader.srcDir, loader.fsrcDir, loader.contractNames);

    }

    public materials(contractName: string) {
        return this._compiler.materialOf(contractName);
    }

    public networks(networkId: string) {
        return this._networks.get(networkId);
    }

    public accounts(networkId: string) {
        return this._accounts.get(networkId);
    }
}