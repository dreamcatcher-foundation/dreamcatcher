import type {ReactNode} from "react";
import type {FlexRowProps} from "@component/FlexRowProps";
import {FlexRow} from "@component/FlexRow";
import {Typography} from "@component/Typography";
import {useSpring} from "react-spring";
import {config} from "react-spring";
import * as ColorPalette from "@component/ColorPalette";

export interface RetroMinimaButtonProps extends FlexRowProps {
    caption: string;
}

export function RetroMinimaButton({
    caption,
    style,
    ... more
}: RetroMinimaButtonProps): ReactNode {
    let [padding, setPadding] = useSpring(() => ({padding: "2px", config: config.stiff}));
    return <>
        <FlexRow 
        style={{
            width: "100px",
            aspectRatio: "4/1", 
            borderWidth: "1px", 
            borderStyle: "solid", 
            borderColor: ColorPalette.TITANIUM.toString(), 
            ... padding,
            ... style
        }} 
        {... more}>
            <FlexRow
            onMouseEnter={() => {
                setPadding.start({padding: "0px"});
                return;
            }}
            onMouseLeave={() => {
                setPadding.start({padding: "2px"});
                return;
            }}
            style={{
                width: "100%",
                height: "100%",
                borderWidth: "1px", 
                borderStyle: "solid", 
                borderColor: ColorPalette.TITANIUM.toString(),
                background: ColorPalette.TITANIUM.toString()
            }}
            {... more}>
                <Typography
                content={caption}
                style={{
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    fontSize: "0.75em",
                    color: ColorPalette.OBSIDIAN.toString()
                }}/>
            </FlexRow>
        </FlexRow>
    </>; 
}