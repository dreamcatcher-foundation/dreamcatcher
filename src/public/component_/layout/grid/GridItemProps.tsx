import type {BaseProps} from "src/public/component_/base/BaseProps";
import type {GridItemCoordinate} from "src/public/component_/layout/grid/GridItemCoordinate";

export type GridItemProps
    = 
    & BaseProps 
    & {
        coordinate0: GridItemCoordinate;
        coordinate1: GridItemCoordinate;
    };