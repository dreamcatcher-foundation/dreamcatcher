import type {SelectorArithmeticType} from "@doka/SelectorArithmeticType";
import type {SelectorBaseType} from "@doka/SelectorBaseType";
import type {SelectorArrayType} from "@doka/SelectorArrayType";
import type {SelectorStructType} from "@doka/SelectorStructType";

export type SelectorType = 
    | SelectorArithmeticType 
    | SelectorBaseType 
    | SelectorArrayType 
    | SelectorStructType;