import * as FileSystem from "fs";
import * as Path from "path";
import * as ChildProcess from "child_process";
import * as Solc from "solc"; // => This is ok.
import * as Ethers from "ethers";
import moize from "moize";

import {CompiledContractMaterial} from "./CompiledContractMaterial.ts";
import {Config} from "./Config.ts";

export class Engine {
    private networks_: {[k: string]: undefined | Ethers.JsonRpcProvider};
    private accounts_: {[k: string]: undefined | Ethers.Wallet};
    private material_: {[k: string]: undefined | CompiledContractMaterial};

    public constructor(config: {
        contracts: ({
            name: string;
            path: string;
        })[];
        fSrcDir: string;
        networks: ({
            name: string;
            rpcUrl: string;
            privateKey: string;
        })[];
        application: (engine: Engine) => void;
        silence: boolean;
    }) {
        if (!config.silence)
            console.log("Engine: loading networks");
        for (let i_ = 0; i_ < config.networks.length; i_++) {
            let network_ = config.networks[i_];
            if (!config.silence)
                console.log(`Engine: loading ${network_.name} network`);
            this.networks_[network_.name] = new Ethers.JsonRpcProvider(network_.rpcUrl);
            this.accounts_[network_.name] = new Ethers.Wallet(network_.privateKey, this.networks_[network_.name]);
        }
        if (!config.silence)
            console.log("Engine: compiling contracts");
        for (let i_ = 0; i_ < config.contracts.length; i_++) {
            let contract_ = new CompiledContractMaterial({
                name:        config.contracts[i_].name,
                path:        config.contracts[i_].path,
                fSrcDir:     config.fSrcDir
            });
        }
    }

    public config(): Readonly<Config> {
        return this.config_;
    }
}