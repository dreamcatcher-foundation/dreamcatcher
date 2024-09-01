import type {SelectorType} from "@doka/SelectorType";
import type {SelectorSignature} from "@doka/SelectorSignature";

export type Selector = {
    name(): 
        string;
    args(): 
        SelectorType[];
    signature(): 
        SelectorSignature;
}

export function Selector(_name: string, ... _args: SelectorType[]): Selector {

    function name(): string {
        return _name;
    }

    function args(): SelectorType[] {
        return _args;
    }

    function signature(): SelectorSignature {
        let args: string = "";
        for (let i = 0; i < _args.length; i += 1) {
            if (i !== 0) {
                args = ", ";
            }
            args += _args[i];
        }
        return `function ${name()}(${args}) external`;
    }

    return {name, args, signature};
}