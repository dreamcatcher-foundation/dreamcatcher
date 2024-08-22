import type {CssUnit} from "@component/type/CssUnit";
import type {CssPropOptions} from "@component/type/CssPropOptions";

export type SizeProps
    = {
        width:
            | CssPropOptions
            | CssUnit;
        height:
            | CssPropOptions
            | CssUnit;
    };