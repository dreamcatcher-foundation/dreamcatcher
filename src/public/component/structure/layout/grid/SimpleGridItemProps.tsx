import type {BaseProps} from "@component/BaseProps";
import type {SimpleGridItemCoordinate} from "@component/SimpleGridItemCoordinate";

export type SimpleGridItemProps
    =
    & BaseProps
    & {
        start: SimpleGridItemCoordinate;
        end: SimpleGridItemCoordinate;
    };