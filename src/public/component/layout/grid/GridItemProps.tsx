import type {BaseProps} from "@component/base/BaseProps";
import type {GridItemCoordinate} from "@component/layout/grid/GridItemCoordinate";

export type GridItemProps
    = 
    & BaseProps 
    & {
        coordinate0: GridItemCoordinate;
        coordinate1: GridItemCoordinate;
    };