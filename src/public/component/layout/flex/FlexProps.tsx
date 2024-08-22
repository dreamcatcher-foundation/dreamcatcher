import type {BaseProps} from "@component/base/BaseProps";
import type {SizeProps} from "@component/base/prop/SizeProps";
import type {CssPropOptions} from "@component/type/CssPropOptions";

export type FlexProps
    =
    & BaseProps
    & SizeProps
    & {
        flexDirection:
            | CssPropOptions
            | "column"
            | "column-reverse"
            | "row"
            | "row-reverse";
        justifyContent:
            | CssPropOptions
            | "center"
            | "end"
            | "flex-end"
            | "flex-start"
            | "left"
            | "normal"
            | "right"
            | "space-around"
            | "space-between"
            | "space-evenly"
            | "start"
            | "stretch";
        alignItems:
            | CssPropOptions
            | "baseline"
            | "center"
            | "end"
            | "flex-end"
            | "flex-start"
            | "normal"
            | "self-end"
            | "self-start"
            | "start"
            | "stretch";
    };