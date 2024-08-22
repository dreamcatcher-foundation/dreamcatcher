import type {ReactNode} from "react";
import type {ComponentPropsWithRef} from "react";
import type {ColorLike} from "@lib/Color";
import {animated} from "react-spring";

export type NativeCssPropOptions
    =
    | "-moz-initial"
    | "inherit"
    | "initial"
    | "revert"
    | "revert-layer"
    | "unset";

export type Scale 
    =
    | "mm"
    | "cm"
    | "Q"
    | "in"
    | "pt"
    | "pc"
    | "px"
    | "em"
    | "ex"
    | "ch"
    | "rem"
    | "lh"
    | "rlh"
    | "vh"
    | "vw"
    | "vmin"
    | "vmax"
    | "vb"
    | "vi"
    | "svw"
    | "svh"
    | "lvw"
    | "lvh"
    | "dvw"
    | "dvh";

export type Units = `${number}${Scale}`;

export type BaseProps = ComponentPropsWithRef<typeof animated.div>;

export function Base(props: BaseProps): ReactNode {
    let {... more} = props;
    return <>
        <animated.div
        {... more}/>
    </>;
}

export type GridOpCode
    =
    | string
    | bigint
    | Units[];

export type SizeProps 
    = {
        w:
            | NativeCssPropOptions
            | string
            | Units
            | "auto";
        h:
            | NativeCssPropOptions
            | string
            | Units
            | "auto";
    };

export type GridProps 
    = 
    | BaseProps 
    & SizeProps 
    & {
        rows: GridOpCode;
        cols: GridOpCode;
    };

export function Grid(props: GridProps): ReactNode {
    let {w, h, rows, cols, style, ... more} = props;
    let parsed0: string = "";
    let parsed1: string = "";
    if (typeof rows === "string") parsed0 = rows;
    if (typeof cols === "string") parsed1 = cols;
    if (typeof rows === "bigint") parsed0 = "repeat(" + Number(rows) + ", 1fr)";
    if (typeof cols === "bigint") parsed1 = "repeat(" + Number(cols) + ", 1fr)";
    if (Array.isArray(rows)) {
        for (let i = 0; i < rows.length; i += 1) {
            let units: Units = rows[i];
            if (i !== 0) {
                parsed0 += ", ";
            }
            parsed0 += units;
        }
    }
    if (Array.isArray(cols)) {
        for (let i = 0; i < cols.length; i += 1) {
            let units: Units = cols[i];
            if (i !== 0) {
                parsed1 += ", ";
            }
            parsed1 += units;
        }
    }
    return <>
        <Base
        style={{
            width: w,
            height: h,
            display: "grid",
            gridTemplateRows: parsed1,
            gridTemplateColumns: parsed0,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}

export type GridItemProps 
    =
    & BaseProps
    & {
        x0: bigint;
        y0: bigint;
        x1: bigint;
        y1: bigint;
    };

export function GridItem(props: GridItemProps): ReactNode {
    let {x0, y0, x1, y1, style, ... more} = props;
    return <>
        <Base
        style={{
            gridRowStart: String(Number(x0)),
            gridRowEnd: String(Number(x1)),
            gridColumnStart: String(Number(y0)),
            gridColumnEnd: String(Number(y1)),
            ... style ?? {}
        }}
        {... more}/>
    </>
}

export type FlexProps
    =
    & BaseProps
    & SizeProps
    & {
        flexDirection:
            | NativeCssPropOptions
            | "column"
            | "column-reverse"
            | "row"
            | "row-reverse";
        justifyContent:
            | NativeCssPropOptions
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
            | NativeCssPropOptions
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

export function Flex(props: FlexProps): ReactNode {
    let {w, h, flexDirection, justifyContent, alignItems, style, ... more} = props;
    return <>
        <Base
        style={{
            width: w,
            height: h,
            display: "flex",
            flexDirection: flexDirection,
            justifyContent: justifyContent,
            alignItems: alignItems,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}

export type FlexRowProps = Omit<FlexProps, "flexDirection">;

export function FlexRow(props: FlexRowProps): ReactNode {
    let {w, h, justifyContent, alignItems, ... more} = props;
    return <>
        <Flex
        w={w}
        h={h}
        flexDirection="row"
        justifyContent={justifyContent}
        alignItems={alignItems}
        {... more}/>
    </>;
}

export type FlexColProps = Omit<FlexProps, "flexDirection">;

export function FlexCol(props: FlexColProps): ReactNode {
    let {w, h, justifyContent, alignItems, ... more} = props;
    return <>
        <Flex
        w={w}
        h={h}
        flexDirection="column"
        justifyContent={justifyContent}
        alignItems={alignItems}
        {... more}/>
    </>;   
}

export type FlexItemProps
    =
    & BaseProps
    & SizeProps
    & {
        order:
            | NativeCssPropOptions
            | bigint;
        flexGrow:
            | NativeCssPropOptions
            | number;
        flexShrink:
            | NativeCssPropOptions
            | number;
        flexBasis:
            | NativeCssPropOptions
            | Units
            | "auto";
    };

export function FlexItem(props: FlexItemProps): ReactNode {
    let {w, h, order, flexGrow, flexShrink, flexBasis, style, ... more} = props;
    return <>
        <Base
        style={{
            width: w,
            height: h,
            order: typeof order === "bigint" ? Number(order) : order,
            flexGrow: flexGrow,
            flexShrink: flexShrink,
            flexBasis: flexBasis === "auto" ? undefined : flexBasis,
            ... style ?? {}
        }}
        {... more}/>
    </>;
}

export type TextProps
    =
    & BaseProps
    & {
        content: string;
        fontSize:
            | NativeCssPropOptions
            | Units;
        fontWeight:
            | NativeCssPropOptions
            | "bold"
            | "bolder"
            | "lighter"
            | "normal";
        fontFamily:
            | NativeCssPropOptions
            | "cursive"
            | "fantasy"
            | "monospace"
            | "sans-serif"
            | "serif"
            | string;
        color: ColorLike;
    };

export function Text(props: TextProps): ReactNode {
    let {content, fontSize, fontWeight, fontFamily, color, ... more} = props;
    return <>
        <FlexRow
        w="auto"
        h="auto"
        justifyContent="center"
        alignItems="center"
        style={{
            fontSize: fontSize,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
            color: color.toString()
        }}
        {... more}>
            {content}
        </FlexRow>
    </>;
}

