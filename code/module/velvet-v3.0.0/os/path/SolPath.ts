import {exec} from "child_process";
import {readFileSync} from "fs";
import {unlinkSync} from "fs";
import solc from "solc";
import Path from "./Path.ts";
import Timer from "../../Timer.ts";

export default class SolPath extends Path {
    public constructor(path: string) {
        super(path);
    }

    public override name(): string  {
        if (!super.name()) {
            throw new Error("SolPath: cannot find the name of its path");
        }
        return super.name()!;
    }

    public extension(): string {
        return "sol";
    }

    public flattenedSolPath(): string {
        return `${__dirname}/${this.name()}.${this.extension()}`;
    }

    public parsedContent(): string {
        exec(`bun hardhat flatten ${this._path} > ${this.flattenedSolPath()}`);
        Timer.sleepSync(500n);
        const content: string = readFileSync(this.flattenedSolPath(), "utf8");
        unlinkSync(this.flattenedSolPath());
        return content;
    }

    public bytecode(): string {
        if (this.errors().length == 0) {
            return this._output()
                ?.contracts
                ?.[this.name()]
                ?.[this.name()]
                ?.evm
                ?.bytecode
                ?.object ?? "";
        }
        return "";
    }

    public abi(): object[] {
        if (this.errors().length == 0) {
            return structuredClone(
                this._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.abi ?? []
            );
        }
        return structuredClone([]);
    }

    public methods(): object {
        if (this.errors().length == 0) {
            return structuredClone(
                this._output()
                    ?.contracts
                    ?.[this.name()]
                    ?.[this.name()]
                    ?.evm
                    ?.methodIdentifiers ?? {}
            );
        }
        return structuredClone({});
    }

    public errors(): string[] {
        const errors: string[] = [];
        for (let i = 0; i < this._output().errors.length; i++) {
            if (this._output().errors[i].severity == "error") {
                errors.push(this._output().errors[i].formattedMessage);
            }
        }
        return structuredClone(errors);
    }

    public warnings(): string[] {
        const warnings: string[] = [];
        for (let i = 0; i < this._output().errors.length; i++) {
            if (this._output().errors[i].severity != "error") {
                warnings.push(this._output().errors[i].formattedMessage);
            }
        }
        return structuredClone(warnings);
    }

    private _output(): any {
        const solcIn = {
            "language": "Solidity",
            "sources": {
                [this.name()]: {
                    "content": this.parsedContent()
                }
            },
            "settings": ({
                "outputSelection": ({
                    "*": ({
                        "*": ([
                            "abi",
                            "evm.bytecode",
                            "evm.methodIdentifiers"
                        ])
                    })
                })
            })
        } as const;
        const solcInString: string = JSON.stringify(solcIn);
        const solcOutString: string = solc.compile(solcInString);
        return JSON.parse(solcOutString);
    }
}