import type {SizeProps} from "@component/SizeProps";
import type {ChildrenProps} from "@component/ChildrenProps";

export type GridProps
    =
    & ChildrenProps
    & SizeProps
    & {
        rowCount: bigint;
        colCount: bigint;
    };