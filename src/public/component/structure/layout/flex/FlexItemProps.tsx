import type {CssPropOptions} from "@component/CssPropOptions";
import type {CssAutoPropOption} from "@component/CssAutoPropOption";
import type {CssUnit} from "@component/CssUnit";

export type FlexItemProps
    = {
        order:
            | CssPropOptions
            | bigint;
        flexGrow:
            | CssPropOptions
            | number;
        flexShrink:
            | CssPropOptions
            | number;
        flexBasis:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
    };