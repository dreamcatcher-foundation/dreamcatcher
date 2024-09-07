import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {FlexCol} from "@component/FlexCol";
import * as ColorPalette from "@component/ColorPalette";

export interface RetroMinimaCardContainerProps extends FlexColProps {}

export function RetroMinimaCardContainer({
    style,
    ... more
}: RetroMinimaCardContainerProps): ReactNode {
    return <>
        <FlexCol 
            style={{
                borderWidth: "1px", 
                borderStyle: "dashed", 
                borderColor: ColorPalette.GHOST_IRON.toString(),
                padding: "10px",
                ... style ?? {}}} 
                {... more}
        />
    </>;
}