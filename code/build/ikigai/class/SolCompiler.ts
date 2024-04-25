import solc from "solc";
import {exec} from "child_process";
import {readFileSync} from "fs";
import SolCompilationMaterial from "./SolCompilationMaterial.ts";
import type ISolCompilationMaterial from "../interface/ISolCompilationMaterial.ts";
import type ISolCompiler from "../interface/ISolCompiler.ts";

class SolCompiler implements ISolCompiler {
    private _cache: {[name: string]: ISolCompilationMaterial | undefined} = {};

    public constructor() {}

    public get cache() {
        return this._cache;
    }

    public compile(name: string, path: string, fSrcDir: string) {
        const fSrcPath = `${fSrcDir}/${name}.sol`;
        this._executeHardhatFlattenCommand(path, fSrcPath);
        this._wait(500n);
        const compiled = this._compile(name, fSrcPath);
        if (!compiled) return false;
        if (!(compiled as any).errors) {
            const material = new SolCompilationMaterial();
            material.ABI = (compiled as any)
                ?.contracts
                ?.[name]
                ?.[name]
                ?.abi;
            material.bytecode = (compiled as any)
                ?.contracts
                ?.[name]
                ?.[name]
                ?.evm
                ?.bytecode
                ?.object;
            material.warnings = [];
            material.errors = [];
            material.markSafe();
            this._cache[name] = material;
            return true;
        }
        const warnings = (compiled as any).errors;
        const errors = [];
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
            this._cache[name] = material;
            return false;
        }
        const material = new SolCompilationMaterial();
        material.ABI = (compiled as any)
            ?.contracts
            ?.[name]
            ?.[name]
            ?.abi;
        material.bytecode = (compiled as any)
            ?.contracts
            ?.[name]
            ?.[name]
            ?.evm
            ?.bytecode
            ?.object;
        material.warnings = warnings;
        material.errors = [];
        material.markSafe();
        this._cache[name] = material;
        return true;
    }

    private _compile(name: string, fSrcPath: string) {
        const solcIn = {
            language: "Solidity",
            sources: {
                [name]: {
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

    private _executeHardhatFlattenCommand(path0: string, path1: string) {
        exec(`bun hardhat flatten ${path0} > ${path1}`);
        return true;
    }

    private _wait(ms: bigint) {
        const timestamp = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < (timestamp + ms));
        return true;
    }
}