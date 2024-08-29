import type {ReactNode} from "react";
import type {TypographyProps} from "@component/TypographyProps";
import {Base} from "@component/Base";
import * as ColorPalette from "@component/ColorPalette";

export function Typography(props: TypographyProps): ReactNode {
    let {content, style, ... more} = props;
    return <>
        <Base
        style={{
            fontSize: "1em",
            fontWeight: "bold",
            fontFamily: "satoshiRegular",
            color: ColorPalette.TITANIUM.toString(),
            ... style ?? {}
        }}
        {... more}>
            {content}
        </Base>
    </>;
}