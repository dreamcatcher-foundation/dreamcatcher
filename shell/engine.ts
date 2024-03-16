import * as FileSystem from 'fs';
import * as Path from 'path';
import * as ChildProcess from 'child_process';
import * as Solc from 'solc';
import * as Ethers from 'ethers';
import { loader } from './EngineLoader.ts';


export interface Loader {
    'srcDir': string;
    'fsrcDir': string;
    'contractIds': string[];
    'app': (loaded: Loaded) => void;
    'networks': ({
        'name': string;
        'rpcUrl': string;
        'privateKeys': string[];
    })[];
}

interface CompiledContract {
    abi: () => object[];
    bytecode: () => unknown;
    warnings: () => object | 'no errors or warnings';
}

/**
 * NOTE Unfurtunately this section is not as performant. There
 *      are a lot of repeated calls and would require memoization
 *      but due to time constraints this will have to do. The
 *      alternative is this section being writte as a massive
 *      block of code ... trust me, this is more pleasant.
 */
function CompiledContract(srcDir: string, fsrcDir: string, name: string) {
    let self: CompiledContract;
    let _abi: object[];
    let _bytecode: unknown;
    let _warnings: object | 'no errors or warnings';

    (function() {

        function path() {
            return _path(srcDir, name, 'sol');
        }

        function compiled() {
            if (!path()) throw new Error('missing path');
            return _compile(path()!, fsrcDir, name);
        }

        const content: any = compiled();

        _abi = content['contracts'][name][name]['abi'];
        _bytecode = content['contracts'][name][name]['evm']['bytecode']['object'];

        if (content['errors']) _warnings = content['errors'];
        else _warnings = 'no errors or warnings';
    })();

    function abi(): object[] {
        return _abi;
    }

    function bytecode(): unknown {
        return _bytecode;
    }

    function warnings(): object | 'no errors or warnings' {
        return _warnings;
    }

    function _path(dir: string, name: string, extension: string): string | undefined {
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
                if (_path(path(), name, extension)) return result = _path(path(), name, extension);
            }
            
            else if (
                paths()[i].startsWith(name) &&
                paths()[i].endsWith(`.${extension}`)
            ) result = path();
        }

        return result;
    }

    function _compile(path: string, fsrcDir: string, name: string) {

        function fsrcPath(): string {
            return `${fsrcDir}/${name}.sol`;
        }

        function flatten(): void {
            ChildProcess.exec(`bun hardhat flatten ${path} > ${fsrcPath()}`);
            return;
        }

        /**
         * NOTE .5 seconds is the sweet spot, or the compiled 
         *      output will return undefined.
         */
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
        /**
         * NOTE Sync exec does not work due to this version
         *      of node being incompatible with hardhat. The
         *      downside of using Bun with hardhat.
         */
        delay();
        return compiled();
    }

    return self = {
        abi,
        bytecode,
        warnings
    };
}

export interface Loaded {
    contracts: (contractId: string) => CompiledContract | undefined;
    networks: (networkId: string) => Ethers.JsonRpcProvider | undefined;
    accounts: (networkId: string) => Ethers.Wallet | undefined;
}

function Loaded(loader: Loader) {
    let self: Loaded;
    let _contracts: Map<string, CompiledContract> = new Map();
    let _networks: Map<string, Ethers.JsonRpcProvider> = new Map();
    let _accounts: Map<string, Ethers.Wallet> = new Map();

    (function() {
        for (let i = 0; i < loader.contractIds.length; i++) {
            const contractCompilationMaterial: CompiledContract = CompiledContract(
                loader.srcDir, 
                loader.fsrcDir, 
                loader.contractIds[i]
            );

            _contracts.set(loader.contractIds[i], contractCompilationMaterial);
        }

        for (let i = 0; i < loader.networks.length; i++) {
            const network = loader.networks[i];
            _networks.set(network.name, new Ethers.JsonRpcProvider(network.rpcUrl));
            _accounts.set(network.name, new Ethers.Wallet(network.privateKeys[0], _networks.get(network.name)));
        }
    })();

    function contracts(contractId: string): CompiledContract | undefined {
        return _contracts.get(contractId);
    }

    function networks(networkId: string): Ethers.JsonRpcProvider | undefined {
        return _networks.get(networkId);
    }

    function accounts(networkId: string): Ethers.Wallet | undefined {
        return _accounts.get(networkId);
    }

    return self = {
        contracts,
        networks,
        accounts
    };
}

(async function() {
    const loaded: Loaded = Loaded(loader);
    return loader.app(loaded);
})();