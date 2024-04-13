import {writeFileSync, readFileSync, existsSync} from "fs";
import {join} from "path";
import {exec, execSync} from "child_process";
import express from "express";
import {ContractFactory, JsonRpcProvider, Wallet, Contract} from "ethers";
import solc from "solc";

class loader {
    private static _staticPath: string = "";
    private static _solBuildPath: string = "";
    private static _contracts: ({
        name: string;
        path: string;
    })[] = [];
    private static _networks: ({
        name: string;
        url: string;
        key: string;
    })[] = [];

    private constructor() {}

    public static staticPath() {
        return loader._staticPath;
    }

    public static solBuildPath() {
        return loader._solBuildPath;
    }

    public static contracts() {
        return loader._contracts;
    }

    public static networks() {
        return loader._networks;
    }

    public static setStaticPath(path: string) {
        loader._staticPath = path;
        return this;
    }

    public static setSolBuildPath(path: string) {
        loader._solBuildPath = path;
        return this;
    }

    public static addContract(name: string, path: string) {
        loader._contracts.push({name, path});
        return this;
    }

    public static addNetwork(name: string, url: string, key: string) {
        loader._networks.push({name, url, key});
        return this;
    }
}

class SolCompilationMaterial {
    private _ABI: object[] = [];
    private _bytecode: string = "";
    private _warnings: object[] = [];
    private _errors: object[] = [];
    private _ok: boolean = false;

    public constructor() {}

    public get ABI() {
        return this._ABI;
    }

    public get bytecode() {
        return this._bytecode;
    }

    public get warnings() {
        return this._warnings;
    }

    public get errors() {
        return this._errors;
    }

    public set ABI(ABI: object[]) {
        this._ABI = ABI;
    }

    public set bytecode(bytecode: string) {
        this._bytecode = bytecode;
    }

    public set warnings(warnings: object[]) {
        this._warnings = warnings;
    }

    public set errors(errors: object[]) {
        this._errors = errors;
    }

    public get ok() {
        return this._ok;
    }

    public markSafe() {
        this._ok = true;
        return true;
    }

    public markUnsafe() {
        this._ok = false;
        return true;
    }
}

class solCompiler {
    private static _cache: {[contractName: string]: SolCompilationMaterial | undefined} = {};

    private constructor() {}

    public static cache() {
        return this._cache;
    }

    public static compile(contractName: string, contractPath: string, fSrcDir: string) {
        const fSrcPath = `${fSrcDir}/${contractName}.sol`;
        solCompiler
            ._execFlattenCommand(contractPath, fSrcPath)
            ._wait(500n);
        const compiled = solCompiler._compile(contractName, fSrcPath);
        if (!compiled) return false;
        if (!(compiled as any).errors) {
            const material = new SolCompilationMaterial();
            material.ABI = (compiled as any)
                ?.contracts
                ?.[contractName]
                ?.[contractName]
                ?.abi;
            material.bytecode = (compiled as any)
                ?.contracts
                ?.[contractName]
                ?.[contractName]
                ?.evm
                ?.bytecode
                ?.object;
            material.warnings = [];
            material.errors = [];
            material.markSafe();
            this._cache[contractName] = material;
            return this;
        }
        const warnings = (compiled as any).errors;
        const errors: any[] = [];
        for (let i = 0; i < warnings.length; i++) {
            const warning = warnings[i];
            if ((warning as any).severity == "error") {
                const error = warnings.splice(i, 1);
                errors.push(error);
            }
        }
        if (errors.length != 0) {
            for (let i = 0; i < errors.length; i++) {
                const error = errors[i][0];
                const formattedMessage = (error as any).formattedMessage;
                console.error(formattedMessage);
            }
            const material = new SolCompilationMaterial();
            material.ABI = [];
            material.bytecode = "";
            material.warnings = warnings;
            material.errors = errors;
            material.markUnsafe();
            solCompiler._cache[contractName] = material;
            return this;
        }
        const material = new SolCompilationMaterial();
        material.ABI = (compiled as any)
            ?.contracts
            ?.[contractName]
            ?.[contractName]
            ?.abi;
        material.bytecode = (compiled as any)
            ?.contracts
            ?.[contractName]
            ?.[contractName]
            ?.evm
            ?.bytecode
            ?.object;
        material.warnings = warnings;
        material.errors = [];
        material.markSafe();
        solCompiler._cache[contractName] = material;
        return this;
    }

    private static _compile(contractName: string, fSrcPath: string) {
        const solcIn = {
            language: "Solidity",
            sources: {
                [contractName]: {
                    content: readFileSync(fSrcPath, "utf8")
                }
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": [
                            "abi",
                            "evm.bytecode",
                            "evm.methodIdentifiers"
                        ]
                    }
                }
            }
        } as const;
        const solcStringIn = JSON.stringify(solcIn);
        const solcStringOut = solc.compile(solcStringIn);
        return JSON.parse(solcStringOut);
    }

    private static _execFlattenCommand(path0: string, path1: string) {
        exec(`bun hardhat flatten ${path0} > ${path1}`);
        return this;
    }

    private static _wait(ms: bigint) {
        const timestamp = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < (timestamp + ms));
        return this;
    }
}

class engine {
    private static _networks: {[networkName: string]: JsonRpcProvider | undefined} = {};
    private static _accounts: {[networkName: string]: Wallet | undefined} = {};
    private static _material: {[contractName: string]: SolCompilationMaterial | undefined} = {};

    private constructor() {}

    public static build() {
        const contracts = loader.contracts();
        const buildPath = loader.solBuildPath();
        for (let i = 0; i < contracts.length; i++) {
            const contract = contracts[i];
            const contractName = contract.name;
            const contractPath = contract.path;
            solCompiler.compile(contractName, contractPath, buildPath);
            const material = solCompiler.cache()[contractName];
            if (material && material.ok) {
                engine._material[contractName] = material;
            }
        }
        const networks = loader.networks();
        for (let i = 0; i < networks.length; i++) {
            const network = networks[i];
            const networkName = network.name;
            const networkUrl = network.url;
            const networkKey = network.key;
            const provider = new JsonRpcProvider(networkUrl);
            engine._networks[networkName] = provider;
            engine._accounts[networkName] = new Wallet(networkKey, provider);
        }
        return this;
    }

    public static networks() {
        return engine._networks;
    }

    public static accounts() {
        return engine._accounts;
    }

    public static material() {
        return engine._material;
    }

    public static async deploy(networkName: string, contractName: string, ...args: any[]) {
        return await engine
            ?.factory(networkName, contractName)
            ?.deploy(...args);
    }

    public static factory(networkName: string, contractName: string) {
        const account = engine.accounts()[networkName];
        const material = engine.material()[contractName];
        if (!account || !material) {
            return undefined;
        }
        return new ContractFactory(material.ABI, material.bytecode, account);
    }

    public static contract(networkName: string, contractName: string, address: string) {
        const account = engine.accounts()[networkName];
        const material = engine.material()[contractName];
        if (!account || !material) {
            return undefined;
        }
        return new Contract(address, material.ABI, account);
    }
}

class appCompiler {
    public static compile() {
        const staticDirPath = loader.staticPath();
        if (!existsSync(`${loader.staticPath()}/app/App.html`)) return;
        if (!existsSync(`${loader.staticPath()}/app/App.tsx`)) return;
        execSync(`bun build ${`${loader.staticPath()}/app/App.tsx`} --outdir ${loader.staticPath()}/app`);
    }
}

(function() {
    console.log("ServerScript: parsing loader");
    loader
        /**
         * NOTE Required static dir that will act as the express app's
         *      root. The app should be located within this static folder and
         *      the server expects the sol contracts to be there as well, under
         *      the contract dir.
         * 
         * NOTE The app must contain an app.tsx and app.html file. In the app
         *      dir. On build an app.js file will be created if there isn't one,
         *      or will update one.
         * 
         * NOTE Remember to link the app.js file in the app.html file.
         */
        .setStaticPath("code/build/HonoBuild/static")
        /**
         * NOTE The build file is used to create flattened files of
         *      the solidity contracts. This is required for
         *      compilation.
         * 
         * NOTE The compiler uses the solc 0.8.27 solc version and
         *      will produce the respective bytecode and ABI in the
         *      build file.
         * 
         * NOTE This is used on the server side to offer updated ABI
         *      and bytecode to deploy and interact with
         *      the contracts.
         * 
         * NOTE Custom ABI such as ERC20 ABI can also be added in the
         *      build directory.
         */
        .setSolBuildPath("code/build/HonoBuild/static/sol/build")
        .addContract("Diamond", "code/build/HonoBuild/static/sol/src/native/solidstate/Diamond.sol");
    console.log("ServerScript: building engine");
    engine.build();
    console.log("ServerScript: compiling app");
    appCompiler.compile();
})();

(function() {
    console.log("ServerScript: serving app");
    express()
        .get("/data", async function(req, res) {
            res.send({});
        })
        .use(express.static(join(__dirname, "/static/app")))
        .get("/", async function(req, res) {
            res.sendFile(join(__dirname, "/static/app/App.html"));
        })
        .listen(3000);
})();