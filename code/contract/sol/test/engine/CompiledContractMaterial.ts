import * as FileSystem from "fs";
import * as Path from "path";
import * as ChildProcess from "child_process";
import * as Solc from "solc"; // => This is ok.
import * as Ethers from "ethers";
import moize from "moize";

export function ReadonlyContractMaterialStruct(
    name: string = "",
    path: string = "",
    fSrcDir: string = ""
) {
    let ABI: object[] = [];
    let bytecode: string = "";
    let warnings: object[] = [];
    let errors: object[] = [];
    let isValid: boolean = false;

    if (name === "" || path === "" || fSrcDir === "")
        return {
            readonly name,
            readonly path,
            readonly fSrcDir,
            readonly ABI,
            readonly bytecode,
            readonly warnings,
            readonly errors,
            readonly isValid
        }

    /**
     * NOTE Sync exec does not work due to this version of node
     *      not being compatible with hardhat. This is one of the
     *      drawbacks of using Bun and hardhat, this will likely be
     *      fixed in the future.
     * 
     * NOTE 0.5 seconds is the sweet spot, if you are getting undefined
     *      errors or anomalous behaviour it may be because
     *      your computer is slower at compiling and does not
     *      finish before the timer is over.
     */
    delay_(500n);

    function compile_() {}

    function payload_(name: string, sourcecode: string) {}

    function sourcecode_(fSrcPath: string) {}

    function delay_(ms: bigint) {
        const timestamp: bigint = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < (timestamp + ms));
        return true;
    }

    function flatten_(name: string, path0: string, path1: string) {
        ChildProcess.exec(`bun hardhat flatten ${path0} > ${path1}/${name}.sol`);
        return true;
    }

    function fSrcPath_(name: string, fSrcDir: string) {
        return `${fSrcDir}/${name}.sol`;
    }

    return {
        readonly name,
        readonly path,
        readonly fSrcDir,
        readonly ABI,
        readonly bytecode,
        readonly warnings,
        readonly errors,
        readonly isValid
    }
}



namespace ContractMaterialLibrary {
    export interface ContractMaterial {
        readonly name: string = "";
        readonly path: string = "";
        readonly fSrcDir: string = "";
        readonly ABI: object[] = [];
        readonly bytecode: string = "";
        readonly warnings: object[] = [];
        readonly errors: object[] = [];
        readonly isValid: boolean = false;
    }

    export function generate(name: string, path: string, fSrcDir: string): ContractMaterial {
        try {

        } catch {
            return {
                name: "",
                path: "",
                fSrcDir: "",
                ABI: [],
                bytecode: "",
                warnings: [],
                errors: [],
                isValid: false
            }
        }


        return {
            name: name,
            path: path,
            fSrcDir: fSrcDir
        }
    }

    function compile_(name: string, fSrcDir: string, path: string) {
        flatten_(name, path, fSrcDir);

    }

    function flatten_(name: string, pathIn: string, pathOut: string): boolean {
        ChildProcess.exec(`bun hardhat flatten ${pathIn} > ${pathOut}/${name}.sol`);
        return true;
    }

    function fSrcPath_(name: string, fSrcDir: string): string {
        return `${fSrcDir}/${name}.sol`;
    }
}






function compile(p: {
    material: ContractMaterial;
    name: string;
    path: string;
    fSrcDir: string;

}): ContractMaterial {
    

    return {
        ABI: p.material.ABI,
        bytecode: p.material.bytecode,
        warnings: p.material.warnings,
        errors: p.material.errors
    };
}



function CompiledContractMaterial(p: {
    name: string;
    path: string;
    fSrcDir: string;
}) {
    let ABI_: object[] = [];
    let bytecode_: string = "";
    let warnings_: object[] = [];
    let errors_: object[] = [];

    function ABI() {
        return ABI_;
    }

    function bytecode() {
        return bytecode_;
    }

    return {
        ABI,
        bytecode,
        warnings,
        errors
    }
}


export class CompiledContractMaterials {
    private ABI_: Array<object>;
    private bytecode_: string;
    private warnings_: Array<object>;
    private errors_: Array<object>;

    public constructor({
        name: string;
        path: string;
        fSrcDir: string;
    }) {
        let content_: object = CompiledContractMaterial.compile_(this.name(), this.path(), this.fSrcDir());
        if ((content_ as any).errors) {
            this.warnings_ = (content_ as any).errors;
            for (let i_ = 0; i_ < this.warnings().length; i_++) {
                let warning_: object = this.warnings()[i_];
                if ((warning_ as any).severity == "error") {
                    this.errors_.push(this.warnings_.splice(i_, 1));
                }
            }
            if (this.errors().length != 0) {
                for (let i_ = 0; i_ < this.errors().length; i_++) {
                    let error_: object = this.errors()[i_];
                    let message_: string = error_[i_].formattedMessage;
                    console.error(message_);
                }
                throw `CompiledContractMaterial: failed whilst compiling ${this.name()} due to a solidity issue`;
            }
        }
        this.ABI_ = (content_ as any)?.contracts?.[this.name()]?.[this.name()]?.abi;
        this.bytecode_ = (content_ as any)?.contracts?.[this.name()]?.[this.name()].evm.bytecode.object;
    }

    public ABI(): ReadonlyArray<object> {
        return this.ABI_;
    }

    public bytecode(): string {
        return this.bytecode_;
    }

    public warnings(): ReadonlyArray<object> {
        return this.warnings_;
    }

    public errors(): ReadonlyArray<object> {
        return this.errors_;
    }

    public name(): string {
        return this.name_;
    }

    public path(): string {
        return this.path_;
    }

    public fSrcDir(): string {
        return this.fSrcDir_;
    }

    private static compile_(path: string, fSrcDir: string, name: string): object {
        CompiledContractMaterial.flatten_(name, path, fSrcDir);

        /**
         * NOTE Sync exec does not work due to this version of node
         *      not being compatible with hardhat. This is one of the
         *      drawbacks of using Bun and hardhat, this will likely be
         *      fixed in the future.
         * 
         * NOTE 0.5 seconds is the sweet spot, if you are getting undefined
         *      errors or anomalous behaviour it may be because
         *      your computer is slower at compiling and does not
         *      finish before the timer is over.
         */
        CompiledContractMaterial.delay_(500n);

        let fSrcPath_: string = CompiledContractMaterial.fSrcPath_(name, fSrcDir);
        let sourcecode_: string = CompiledContractMaterial.sourcecode_(fSrcPath_);
        let payload_ = CompiledContractMaterial.payload_(name, sourcecode_);
        let stringifiedPayload_: string = JSON.stringify(payload_);
        let compiledPayload_: string = Solc.compile(stringifiedPayload_);
        return JSON.parse(compiledPayload_);
    }

    private static payload_(name: string, sourcecode: string) {
        return {"language": "Solidity", "sources": {[name]: {"content": sourcecode}}, "settings": {"outputSelection": {"*": {"*": ["abi", "evm.bytecode", "evm.methodIdentifiers"]}}}} as const; 
    }

    private static sourcecode_(fSrcPath: string): string {
        return FileSystem.readFileSync(fSrcPath, "utf8");
    }

    private static delay_(ms: bigint): boolean {
        const timestamp: bigint = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < (timestamp + ms));
        return true;
    }

    private static flatten_(name: string, pathIn: string, pathOut: string): boolean {
        ChildProcess.exec(`bun hardhat flatten ${pathIn} > ${pathOut}/${name}.sol`);
        return true;
    }

    private static fSrcPath_(name: string, fSrcDir: string): string {
        return `${fSrcDir}/${name}.sol`;
    }
}