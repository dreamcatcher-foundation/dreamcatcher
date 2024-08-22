import type {GridItemCoordinate} from "@component/GridItemCoordinate";
import type {ChildrenProps} from "@component/ChildrenProps";

export type GridItemProps
    =
    & ChildrenProps
    & {
        start: GridItemCoordinate;
        end: GridItemCoordinate;
    };