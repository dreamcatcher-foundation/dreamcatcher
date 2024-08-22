import type {BaseProps} from "@component/base/BaseProps";
import type {SizeProps} from "@component/base/prop/SizeProps";
import type {CssPropOptions} from "@component/type/CssPropOptions";
import type {CssAutoPropOption} from "@component/type/CssAutoPropOption";
import type {CssUnit} from "@component/type/CssUnit";

export type FlexItemProps
    =
    & BaseProps
    & SizeProps
    & {
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
            | CssUnit
            | CssAutoPropOption;
    };