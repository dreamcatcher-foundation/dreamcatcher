import type {CssUnit} from "@component/CssUnit";
import type {CssPropOptions} from "@component/CssPropOptions";
import type {CssAutoPropOption} from "@component/CssAutoPropOption";

export type SizeProps
    = {
        minWidth?:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
        maxWidth?:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
        width:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
        minHeight?:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
        maxHeight?:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
        height:
            | CssPropOptions
            | CssAutoPropOption
            | CssUnit;
    };