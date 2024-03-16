import * as FileSystem from 'fs';
import * as Path from 'path';
import * as ChildProcess from 'child_process';
import * as Solc from 'solc'; // -> This is ok.
import * as Ethers from 'ethers';
import moize from 'moize';

export type App = {
    contracts: string[];
    fSrcDir: string;
    srcDir: string;
    networks: ({
        name: string;
        rpcUrl: string;
        privateKey: string;
    })[];
    program: (engine: Engine) => 0 | 1;
    silence: boolean;
}

export type CompiledContractMaterial = ReturnType<typeof CompiledContractMaterial>;

function CompiledContractMaterial(srcDir: string, fsrcDir: string, id: string) {
    let ABI_: object[] = [];
    let bytecode_: string = '';
    let warnings_: object[] = [];
    let errors_: object[] = [];

    (function() {

        const path = moize(function(): string | undefined {   
            return lookfor_(srcDir, id, 'sol');
        });

        const content = moize(function(): any {
            if (!path()) throw new Error('missing path');

            return compile_(path()!, fsrcDir, id);
        });

        if (content()['errors']) warnings_ = content()['errors'];

        // -> Handle solidity compiler error.
        if (warnings_) {
            for (let i = 0; i < warnings_.length; i++) {
                const warning = warnings_[i];
                
                if (warning['severity'] === 'error') {
                    errors_.push(warnings_.splice(i, 1))
                }
                
            }

            if (errors_.length != 0) {
                for (let i = 0; i < errors_.length; i++) {
                    const error = errors_[i];
                    const formattedMessage = error[i]['formattedMessage']
                    console.error(formattedMessage);
                }
    
                throw 'Serenity: SolidityError'
            }
        }

        ABI_ = content()['contracts'][id][id]['abi'];
        bytecode_ = content()['contracts'][id][id]['evm']['bytecode']['object'];
    })();

    function ABI(): object[] {
        return ABI_;
    }

    function bytecode(): unknown {
        return bytecode_;
    }

    function warnings(): object | 'no errors or warnings' {
        return warnings_;
    }

    function compile_(path: string, fSrcDir: string, name: string): unknown {

        function fsrcPath(): string {
            return `${fSrcDir}/${name}.sol`;
        }
    
        function flatten(): void {
            ChildProcess.exec(`bun hardhat flatten ${path} > ${fsrcPath()}`);
            return;
        }
    
        // -> 0.5 seconds is the sweet spot.
        function delay(): void {
            let seconds: bigint = 1n * 500n;
            let timestamp: bigint = BigInt(new Date().getTime());
            while(BigInt(new Date().getTime()) < (timestamp + seconds));
            return;
        }
    
        function sourcecode(): string {
            return FileSystem.readFileSync(fsrcPath(), 'utf8');
        }
    
        function payload() {
            return {"language": "Solidity", "sources": {[name]: {"content": sourcecode()}}, "settings": {"outputSelection": {"*": {"*": ["abi", "evm.bytecode", "evm.methodIdentifiers"]}}}} as const;
        }
    
        function compiled() {
            return JSON.parse(Solc.compile(JSON.stringify(payload())));
        }
    
        flatten();
        
        // -> Sync exec does not work due to this version of node being
        //    incompatible with hardhat.
        //
        // -> Unfurtunately this is one of the few downsides of using
        //    Bun with hardhat.
        delay();
    
        return compiled();
    }
    
    function lookfor_(dir: string, name: string, extension: string): string | undefined {
        let result: string | undefined;
    
        function paths(): string[] {
            return FileSystem.readdirSync(dir);
        }
    
        for (let i = 0; i < paths().length; i++) {
    
            function path(): string {
                return Path.join(dir, paths()[i]);
            }
    
            function stat(): FileSystem.Stats {
                return FileSystem.statSync(path());
            }
    
            if (stat().isDirectory()) {
                result = lookfor_(path(), name, extension);
                
                if (result) return result;
            }
    
            else if (
                paths()[i].startsWith(name) &&
                paths()[i].endsWith(`.${extension}`)
            ) result = path();
        }
    
        return result;
    }

    return {
        ABI,
        bytecode,
        warnings
    }
}

export type Engine = ReturnType<typeof Engine>;

function Engine(
    networks: {[k: string]: undefined | Ethers.JsonRpcProvider},
    accounts: {[k: string]: undefined | Ethers.Wallet},
    material: {[k: string]: undefined | CompiledContractMaterial}
) {
    function createFactory(networkId: string, blueprint: string): 
        | Ethers.ethers.ContractFactory<any[], Ethers.ethers.BaseContract> {
        
        if (!material[blueprint]?.ABI()) throw new Error('missing abi');
        if (!material[blueprint]?.bytecode()) throw new Error('missing bytecode');
        if (!accounts[networkId]) throw new Error('missing account or incorrect network id');

        function ABI() {
            return material[blueprint]!.ABI();
        };

        function bytecode() {
            return material[blueprint]!.bytecode() as any;
        };

        function account() {
            return accounts[networkId];
        }

        return new Ethers.ContractFactory(ABI(), bytecode(), account());
    }

    function createContract(networkId: string, abi: Ethers.InterfaceAbi, address: string): Ethers.ethers.Contract {
        return new Ethers.Contract(address, abi, networks[networkId]);
    }

    async function deployContract(networkId: string, blueprint: string, ...args: any[]): Promise<Ethers.ethers.BaseContract & {deploymentTransaction(): Ethers.ethers.ContractTransactionResponse;} & Omit<Ethers.ethers.BaseContract, keyof Ethers.ethers.BaseContract>> {
        return await createFactory(networkId, blueprint)
            .deploy(...args);
    }

    return {
        createFactory,
        createContract,
        deployContract
    }
}

export async function main(app?: App): Promise<0 | 1> {
    if (!app) throw new Error('missing app');

    if (!app.silence) console.log('loading ...');
    
    const networks: {[k: string]: undefined | Ethers.JsonRpcProvider} = {};
    const accounts: {[k: string]: undefined | Ethers.Wallet} = {};
    const material: {[k: string]: undefined | CompiledContractMaterial} = {};

    (function() {
        for (let i = 0; i < app.networks.length; i++) {
            const network = app.networks[i];

            if (!app.silence) console.log(`loading network ${network.name}`);

            networks[network.name] = new Ethers.JsonRpcProvider(network.rpcUrl);
            accounts[network.name] = new Ethers.Wallet(network.privateKey, networks[network.name]);
        }

        if (!app.silence) console.log('compiling contracts');

        for (let i = 0; i < app.contracts.length; i++) {
            const contract = app.contracts[i];
            const compiled = CompiledContractMaterial(
                app.srcDir,
                app.fSrcDir,
                contract
            );
            material[contract] = compiled;

            if (!app.silence) console.log(`compiled ${contract}`);
        }
    })();

    // -> Run.
    return app.program(Engine(networks, accounts, material));
}