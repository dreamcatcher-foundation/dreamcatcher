// SPDX-License-Identifier: UNLICENSED
import solc from "solc"; // -> This is fine.
import {exec} from "child_process";
import {readFileSync} from "fs";
import {type IReadonlySolCompilationMaterial} from "./interfaces/IReadonlySolCompilationMaterial.ts";
import {type ISolCompiler} from "./interfaces/ISolCompiler.ts";
import {ReadonlySolCompilationMaterial} from "./ReadonlySolCompilationMaterial.ts";

export class SolCompiler implements ISolCompiler {
    public constructor(
        private cache_: {[contractName: string]: IReadonlySolCompilationMaterial | undefined}
    ) {}

    public get cache(): Readonly<{[contractName: string]: IReadonlySolCompilationMaterial | undefined}> {
        return this.cache_;
    }

    public compileAndCache(contractName: string, contractPath: string, fSrcDir: string): boolean {
        const fSrcPath: string = `${fSrcDir}/${contractName}.sol`;
        this.executeHardhatFlattenCommand_(contractPath, fSrcPath);
        /**
         * -> Synced exec does not work on this version of node because
         *    on this version Bun and hardhat are incompatible.
         * 
         * -> 0.5 seconds is the sweet spot and may not work properly if
         *    hardhat does not finish flattening the contract before the
         *    timer is over.
         */
        this.wait_(500n);
        const solcOut: unknown = this.compile_(contractName, fSrcPath);
        if (!solcOut) 
            return false;
        // -> Ok exit with no errors or warnings.
        if (!(solcOut as any).errors) {
            this.cache_[contractName] = new ReadonlySolCompilationMaterial(
                (solcOut as any)
                    ?.contracts
                    ?.[contractName]
                    ?.[contractName]
                    ?.abi,
                (solcOut as any)
                    ?.contracts
                    ?.[contractName]
                    ?.[contractName]
                    ?.evm
                    ?.bytecode
                    ?.object,
                [],
                [],
                true
            );
            return true;
        }
        const warnings: object[] = (solcOut as any).errors;
        const errors: object[] = [];
        for (let i = 0; i < warnings.length; i++) {
            const warning: object = warnings[i];
            if ((warning as any).severity == "error") {
                const error = warnings.splice(i, 1);
                errors.push(error);
            }
        }
        if (errors.length != 0) {
            for (let i = 0; i < errors.length; i++) {
                const error: object = errors[i][0];
                const formattedMessage: string = (error as any).formattedMessage;
                console.error(formattedMessage);
            }
            this.cache_[contractName] = new ReadonlySolCompilationMaterial(
                [],
                "",
                warnings,
                errors,
                false
            );
            return false;
        }
        // -> No breaking errors, exit with warnings.
        this.cache_[contractName] = new ReadonlySolCompilationMaterial(
            (solcOut as any)
                ?.contracts
                ?.[contractName]
                ?.[contractName]
                ?.abi,
            (solcOut as any)
                ?.contracts
                ?.[contractName]
                ?.[contractName]
                ?.evm
                ?.bytecode
                ?.object,
            warnings,
            [],
            true
        );
        return true;
    }

    private compile_(contractName: string, srcPath: string): Readonly<unknown> {
        const solcIn = {
            language: "Solidity",
            sources: {
                [contractName]: {
                    content: readFileSync(srcPath, "utf8")
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
        const solcStringIn: string = JSON.stringify(solcIn);
        const solcStringOut: string = solc.compile(solcStringIn);
        return JSON.parse(solcStringOut);
    }

    private executeHardhatFlattenCommand_(path0: string, path1: string): void {
        exec(`bun hardhat flatten ${path0} > ${path1}`);
        return;
    }

    private wait_(ms: bigint): void {
        const timestamp: bigint = BigInt(new Date().getTime());
        while (BigInt(new Date().getTime()) < (timestamp + ms));
        return;
    }
}