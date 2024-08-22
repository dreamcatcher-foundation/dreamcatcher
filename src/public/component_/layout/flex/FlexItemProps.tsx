import type {BaseProps} from "src/public/component_/base/BaseProps";
import type {SizeProps} from "src/public/component_/base/prop/SizeProps";
import type {CssPropOptions} from "src/public/component/type/css/CssPropOptions";
import type {CssAutoPropOption} from "src/public/component/type/css/CssAutoPropOption";
import type {CssUnit} from "src/public/component/type/css/CssUnit";

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