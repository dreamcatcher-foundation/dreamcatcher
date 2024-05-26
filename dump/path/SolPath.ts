import {Path, PathLike} from "../Path.ts";
import {readFileSync, unlinkSync} from "fs";
import {exec} from "child_process";
import solc from "solc";

interface SolPath extends Path {
    flattenedSolPath: () => string;
    errors: () => string[];
    warnings: () => string[];
    bytecode: () => string;
    abi: () => object[];
    methods: () => object;
}

function SolPath(_pathLike: PathLike): SolPath {
    const instance: SolPath = {
        ...Path(_pathLike),
        ...{
            name,
            flattenedSolPath,
            content,
            errors,
            warnings,
            bytecode,
            abi,
            methods
        }
    };
    
    (function() {
        if (instance.extension() != "sol") {
            throw new Error("INCOMPATIBLE_EXTENSION");
        }
    })();

    function name(): string {
        if (!instance.name()) {
            throw new Error("SolPath: Requires a name but could not parse one.");
        }
        return instance.name()!;
    }

    function flattenedSolPath(): string {
        return `${__dirname}/${name()}.${instance.extension()}`;
    }

    function content(): string {
        exec(`bun hardhat flatten ${instance.value()} > {flattenedSolPath()}`);
        const timestamp: bigint = BigInt(new Date().getTime());
        while(BigInt(new Date().getTime()) < (timestamp + 500n));
        const content: string = readFileSync(flattenedSolPath(), "utf8");
        unlinkSync(flattenedSolPath());
        return content;
    }

    function errors(): string[] {
        try {
            let errors: string[] = [];
            _output().errors.forEach(error => {
                if (error.severity === "error") {
                    errors
                        .push(error.formattedMessage);
                }
            });
            return errors;
        }
        catch {
            return [];
        }
    }

    function warnings(): string[] {
        try {
            let warnings: string[] = [];
            _output().errors.forEach(error => {
                if (error.severity !== "error") {
                    warnings
                        .push(error.formattedMessage);
                }
            });
            return warnings;
        }
        catch {
            return [];
        }
    }

    function bytecode(): string {
        try {
            if (errors().length === 0) {
                return _output()
                    ?.contracts
                    ?.[name()]
                    ?.[name()]
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

    function abi(): object[] {
        try {
            if (errors().length === 0) {
                return _output()
                    ?.contracts
                    ?.[name()]
                    ?.[name()]
                    ?.abi ?? [];
            }
            return [];
        }
        catch {
            return [];
        }
    }

    function methods(): object {
        try {
            if (errors().length === 0) {
                return _output()
                    ?.contracts
                    ?.[name()]
                    ?.[name()]
                    ?.evm
                    ?.methodIdentifiers ?? {};
            }
            return {};
        }
        catch {
            return {};
        }
    }

    function _output(): any {
        const solcIn: object = {
            "language": "Solidity",
            "sources": {
                [name()]: {
                    "content": content()
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
        };
        const solcInString: string = JSON.stringify(solcIn);
        const compiled: any = solc.compile(solcInString);
        return JSON.parse(compiled);
    }

    return instance;
}

export {SolPath, PathLike};