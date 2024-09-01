import type {SelectorBitSize} from "@doka/SelectorBitSize";

export type SelectorArithmeticType = "uint" | "int" | `${"uint" | "int"}${SelectorBitSize}`;