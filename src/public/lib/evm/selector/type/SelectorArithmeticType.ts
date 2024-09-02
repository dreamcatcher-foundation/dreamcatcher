import type {SelectorBitSize} from "./SelectorBitSize";

export type SelectorArithmeticType = "uint" | "int" | `${"uint" | "int"}${SelectorBitSize}`;