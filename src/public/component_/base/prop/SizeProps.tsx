import type {CssUnit} from "src/public/component/type/css/CssUnit";
import type {CssPropOptions} from "src/public/component/type/css/CssPropOptions";
import type {CssAutoPropOption} from "src/public/component/type/css/CssAutoPropOption";

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