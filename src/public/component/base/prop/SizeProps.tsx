import type {CssUnit} from "@component/type/CssUnit";
import type {CssPropOptions} from "@component/type/CssPropOptions";
import type {CssAutoPropOption} from "@component/type/CssAutoPropOption";

export type SizeProps
    = {
        width:
            | CssPropOptions
            | CssUnit
            | CssAutoPropOption;
        height:
            | CssPropOptions
            | CssUnit
            | CssAutoPropOption;
    };