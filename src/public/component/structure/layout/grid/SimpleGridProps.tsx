import type {BaseProps} from "@component/BaseProps";
import type {SizeProps} from "@component/SizeProps";

export type SimpleGridProps
    =
    & BaseProps
    & SizeProps
    & {
        rowCount: bigint;
        colCount: bigint;
    };