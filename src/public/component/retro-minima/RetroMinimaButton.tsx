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
    function onMouseEnter(): void {
        setPadding.start({padding: "0px"});
        return;
    }
    function onMouseLeave(): void {
        setPadding.start({padding: "2px"});
        return;
    }
    return <><FlexRow onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={{width: "100px", aspectRatio: "4/1", borderWidth: "1px", borderStyle: "solid", borderColor: ColorPalette.TITANIUM.toString(), pointerEvents: "auto", cursor: "pointer", ... padding, ... style}} {... more}><RetroMinimaButtonInnerContainer><RetroMinimaButtonCaption caption={caption}/></RetroMinimaButtonInnerContainer></FlexRow></>
}

export function RetroMinimaButtonInnerContainer({children}: {children?: ReactNode;}): ReactNode {
    return <><FlexRow style={{width: "100%", height: "100%", background: ColorPalette.TITANIUM.toString()}}>{children}</FlexRow></>;
}

export function RetroMinimaButtonCaption({caption}: {caption: string;}): ReactNode {
    return <><Typography content={caption} style={{fontWeight: "bold", fontFamily: "monospace", fontSize: "0.75em", color: ColorPalette.OBSIDIAN.toString()}}/></>;
}