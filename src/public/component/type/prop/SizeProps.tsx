import type {CssUnit} from "@component/CssUnit";
import type {CssPropOptions} from "@component/CssPropOptions";
import type {CssAutoPropOption} from "@component/CssAutoPropOption";

export type SizeProps
    = {
        width:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
        height:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
    };