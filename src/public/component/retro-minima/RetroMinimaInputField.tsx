import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {Typography} from "@component/Typography";
import {FlexCol} from "@component/FlexCol";
import {FlexRow} from "@component/FlexRow";
import * as ColorPalette from "@component/ColorPalette";

export interface RetroMinimaInputFieldProps extends FlexColProps {
    caption: string;
    placeholder?: string;
    setInput: (input: string) => unknown;
}

export function RetroMinimaInputField({caption, placeholder, setInput, ... more}: RetroMinimaInputFieldProps): ReactNode {
    return <>
        <FlexCol {... more}>
            <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content={caption} style={{fontSize: "0.5em"}}/></FlexRow>
            <FlexRow style={{width: "100%", height: "5px"}}/>
            <FlexRow style={{width: "100%", justifyContent: "start"}}><FlexRow style={{width: "100%", height: "100%", padding: "5px", gap: "5px", pointerEvents: "auto", borderWidth: "1px", borderStyle: "solid", borderColor: ColorPalette.GHOST_IRON.toString()}}><input onChange={e => setInput(e.target.value)} type="text" placeholder={placeholder} style={{all: "unset", width: "100%", fontSize: "0.75em", pointerEvents: "auto", cursor: "text", color: ColorPalette.TITANIUM.toString(), fontWeight: "bold", fontFamily: "satoshiRegular"}}/></FlexRow></FlexRow>
        </FlexCol>
    </>;
}