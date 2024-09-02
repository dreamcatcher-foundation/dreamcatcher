import type {SelectorType} from "./type/SelectorType";
import type {SelectorSignatureWithReturn} from "./type/SelectorSignatureWithReturn";

export type SelectorWithReturn = {
    name(): 
        string;
    args(): 
        SelectorType[];
    return_(): 
        SelectorType[];
    signature(): 
        SelectorSignatureWithReturn;   
}

export function SelectorWithReturn(_name: string, _args: SelectorType[], _return: SelectorType[]): SelectorWithReturn {

    function name(): string {
        return _name;
    }

    function args(): SelectorType[] {
        return _args;
    }

    function return_(): SelectorType[] {
        return _return;
    }

    function signature(): SelectorSignatureWithReturn {
        let args: string = "";
        for (let i = 0; i < _args.length; i += 1) {
            if (i !== 0) {
                args = ", ";
            }
            args += _args[i];
        }
        let return_: string = "";
        for (let i = 0; i < _return.length; i += 1) {
            if (i !== 0) {
                return_ = ", ";
            }
            return_ += _return[i];
        }
        return `function ${_name}(${args}) external view returns (${return_})`;
    }

    return {name, args, return_, signature};
}