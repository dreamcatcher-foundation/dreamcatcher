import type {SelectorArithmeticType} from "@doka/SelectorArithmeticType";
import type {SelectorByteType} from "@doka/SelectorByteType";
import type {SelectorBaseType} from "@doka/SelectorBaseType";

export type SelectorArrayType = `${SelectorArithmeticType | SelectorByteType | SelectorBaseType}[]`;