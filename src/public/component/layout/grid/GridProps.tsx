import type {BaseProps} from "@component/base/BaseProps";
import type {SizeProps} from "@component/base/prop/SizeProps";

export type GridProps
    =
    & BaseProps
    & SizeProps
    & {
        rowCount: bigint;
        colCount: bigint;
    };