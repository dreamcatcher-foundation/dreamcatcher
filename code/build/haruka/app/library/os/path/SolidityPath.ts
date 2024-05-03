import Path from "./Path.ts";
import {readFileSync, unlinkSync} from "fs";
import {exec} from "child_process";
import Timer from "../../Timer.ts";
import solc from "solc";

export default class SolidityPath extends Path {
    public constructor(pathish: string | Path) {
        super(pathish);
        this._onlyExtensions(["sol"]);
    }

    public override name(): string {
        if (!super.name) {
            throw new Error("SolidityPath: requires a file name but was unable to get one from its path");
        }
        return super.name()!;
    }

    public flattenedSolidityPath(): string {
        return `${__dirname}/${this.name()}.${this.extension()}`;
    }

    public override content(): string {
        exec(`bun hardhat flatten ${this.get()} > ${this.flattenedSolidityPath()}`);
        Timer.sleepSync(500n);
        const content: string = readFileSync(this.flattenedSolidityPath(), "utf8");
        unlinkSync(this.flattenedSolidityPath());
        return content;
    }

    public errors(): string[] {
        try {
            let errors: string[] = [];
            for (let i = 0; i < this._output().errors.length; i++) {
                if (this._output().errors[i].severity == "error") {
                    errors.push(this._output().errors[i].formattedMessage);
                }
            }
            return errors;
        }
        catch {
            return [];
        }
    }

    public warnings(): string[] {
        try {
            let warnings: string[] = [];
            for (let i = 0; i < this._output().errors.length; i++) {
                if (this._output().errors[i].severity != "error") {
                    warnings.push(this._output().errors[i].formattedMessage);
                }
            }
            return warnings;
        }
        catch {
            return [];
        }
    }

    public bytecode(): string {
        try {
            if (this.errors().length == 0) {
                return this
                    ._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.evm
                    ?.bytecode
                    ?.object ?? "";
            }
            return "";
        }
        catch {
            return "";
        }
    }

    public abstractBinaryInterface(): object[] {
        try {
            if (this.errors().length == 0) {
                return this
                    ._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.abi ?? [];
            }
            return [];
        }
        catch {
            return [];
        }
    }

    public methods(): object {
        try {
            if (this.errors().length == 0) {
                return this
                    ._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.evm
                    ?.methodIdentifiers ?? {};
            }
            return {};
        }
        catch {
            return {};
        }
    }

    private _output(): any {
        const solcIn = {
            "language": "Solidity",
            "sources": {
                [this.name()]: {
                    "content": this.content()
                }
            },
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": [
                            "abi",
                            "evm.bytecode",
                            "evm.methodIdentifiers"
                        ]
                    }
                }
            }
        }
        const solcInString: string = JSON.stringify(solcIn);
        const compiled: any = solc.compile(solcInString);
        return JSON.parse(compiled);
    }
}