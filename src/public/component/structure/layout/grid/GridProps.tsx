import type {SizeProps} from "@component/type/prop/SizeProps";

export type GridProps
    =
    & SizeProps
    & {
        rowCount: bigint;
        colCount: bigint;
    };