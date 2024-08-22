import type {CssPropOptions} from "@component/CssPropOptions";

export type FlexProps
    = {
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