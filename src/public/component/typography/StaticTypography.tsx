import type {ReactNode} from "react";
import type {StaticTypographyProps} from "@component/StaticTypographyProps";
import {Base} from "@component/Base";
import * as ColorPalette from "@component/ColorPalette";

export function StaticTypography(props: StaticTypographyProps): ReactNode {
    let {content, style, ... more} = props;
    return <>
        <Base
        style={{
            backgroundImage: ColorPalette.TITANIUM.toString(),
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            ... style ?? {}
        }}
        {... more}>
            {content}
        </Base>
    </>;
}