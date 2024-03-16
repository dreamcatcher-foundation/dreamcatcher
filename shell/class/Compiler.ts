import * as FileSystem from "fs";
import * as Path from "path";
import * as ChildProcess from "child_process";
import * as Solc from "solc";
import { CompiledContractMaterialReadonlyStruct } from "./CompiledContractMaterialReadonlyStruct.ts";

export class Compiler {
    public materials: Map<string, CompiledContractMaterialReadonlyStruct> = new Map();

    public constructor(
        public readonly srcDir: string,
        public readonly fsrcDir: string,
        public readonly contractNames: string[]
    ) {
        for (let i = 0; i < contractNames.length; i++) {
            const path: string | undefined = Compiler._searchForPath(srcDir, contractNames[i], "sol");
            if (!path) throw new Error("missing path");
            this.materials.set(contractNames[i], Compiler._compile(srcDir, fsrcDir));
        } 
    }

    public materialOf(contractName: string): CompiledContractMaterialReadonlyStruct | undefined {
        return this.materials.get(contractName);
    }

    private static _searchForPath(dir: string, name: string, extension: string): string | undefined {
        let result: string | undefined;
        const paths: string[] = FileSystem.readdirSync(dir);
        for (let i = 0; i < paths.length; i++) {
            const path: string = Path.join(dir, paths[i]);
            const stat = FileSystem.statSync(path);
            if (stat.isDirectory()) {
                result = Compiler._searchForPath(path, name, extension);
                if (result) return result;
            } else if (
                paths[i].startsWith(name) &&
                paths[i].endsWith(`.${extension}`)
            ) result = path;
        }
        return result;
    }

    private static _compile(path: string, fsrcDir: string): CompiledContractMaterialReadonlyStruct {
        const contractName: string | undefined = path.split("/").at(-1)?.split(".").at(0);
        if (!contractName) throw new Error("missing contract name");
        const flatSourceCodePath: string = `${fsrcDir}/${contractName}.sol`;
        ChildProcess.exec(`bun hardhat flatten ${path} > ${flatSourceCodePath}`);
        let secondsToWaitFor: bigint = 10n * 1000n;
        let startTimestamp: bigint = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < startTimestamp + secondsToWaitFor);
        const sourceCode: string = FileSystem.readFileSync(flatSourceCodePath, "utf8");
        const compilerPayload = {"language": "Solidity", "sources": {[contractName]: {"content": sourceCode}}, "settings": {"outputSelection": {"*": {"*": ["abi", "evm.bytecode", "evm.methodIdentifiers"]}}}} as const;
        const compiledContent = JSON.parse(Solc.compile(JSON.stringify(compilerPayload)));
        const content = compiledContent["contracts"][contractName][contractName];
        const errorsWarnings = compiledContent["errors"];
        return new CompiledContractMaterialReadonlyStruct(
            content["abi"],
            content["evm"]["bytecode"]["object"],
            content["evm"]["methodIdentifiers"],
            errorsWarnings
        );
    }
}