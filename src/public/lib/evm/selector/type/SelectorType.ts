import type {SelectorArithmeticType} from "./SelectorArithmeticType";
import type {SelectorBaseType} from "./SelectorBaseType";
import type {SelectorArrayType} from "./SelectorArrayType";
import type {SelectorStructType} from "./SelectorStructType";

export type SelectorType = 
    | SelectorArithmeticType 
    | SelectorBaseType 
    | SelectorArrayType 
    | SelectorStructType;