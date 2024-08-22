import type {BaseProps} from "@component/BaseProps";

export type SimpleGridProps
    =
    & BaseProps
    & {
        rowCount: bigint;
        colCount: bigint;
    };