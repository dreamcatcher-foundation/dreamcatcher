import type {CssPropOptions} from "@component/CssPropOptions";
import type {SizeProps} from "@component/SizeProps";
import type {ChildrenProps} from "@component/ChildrenProps";

export type FlexProps
    = 
    & ChildrenProps
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