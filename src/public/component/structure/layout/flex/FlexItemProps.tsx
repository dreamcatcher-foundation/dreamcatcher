import type {SizeProps} from "@component/SizeProps";
import type {CssPropOptions} from "@component/CssPropOptions";
import type {CssAutoPropOption} from "@component/CssAutoPropOption";
import type {CssUnit} from "@component/CssUnit";
import type {ChildrenProps} from "@component/ChildrenProps";

export type FlexItemProps
    =
    & ChildrenProps
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
            | CssAutoPropOption
            | CssUnit;
    };