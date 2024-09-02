import type {SelectorArithmeticType} from "./SelectorArithmeticType";
import type {SelectorByteType} from "./SelectorByteType";
import type {SelectorBaseType} from "./SelectorBaseType";

export type SelectorArrayType = `${SelectorArithmeticType | SelectorByteType | SelectorBaseType}[]`;