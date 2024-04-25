import {JsonRpcProvider, Wallet} from "ethers";
import type ISolCompilationMaterial from "../interface/ISolCompilationMaterial.ts";
import type IServerScriptLoader from "../interface/IServerScriptLoader.ts";

class engine {
    private static _networks: {[networkName: string]: JsonRpcProvider | undefined} = {};
    private static _accounts: {[networkName: string]: Wallet | undefined} = {};
    private static _material: {[contractName: string]: ISolCompilationMaterial | undefined} = {};

    private constructor() {}

    public static build(loader: IServerScriptLoader) {
        
    }
}