import type {BaseProps} from "src/public/component_/base/BaseProps";
import type {SizeProps} from "src/public/component_/base/prop/SizeProps";

export type GridProps
    =
    & BaseProps
    & SizeProps
    & {
        rowCount: bigint;
        colCount: bigint;
    };