import type {ReactNode} from "react";
import type {FlexRowProps} from "@component/FlexRowProps";
import {Typography} from "@component/Typography";
import {FlexRow} from "@component/FlexRow";
import * as ColorPalette from "@component/ColorPalette";

export interface InputFieldProps extends FlexRowProps {
    caption: string;
    placeholder: string;
}

export function InputField({
    caption,
    placeholder,
    ... more
}: InputFieldProps): ReactNode {
    return <>
        <FlexRow style={{gap: "5px", padding: "10px", pointerEvents: "auto"}} {... more}>
            <Typography content="✦"/>
            <input type="text" placeholder={placeholder} style={{all: "unset", width: "100px", fontSize: "0.75em", pointerEvents: "auto", cursor: "text", color: ColorPalette.TITANIUM.toString(), fontWeight: "bold", fontFamily: "satoshiRegular"}}/>
        </FlexRow>
    </>;
}