import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {FlexCol} from "@component/FlexCol";
import {FlexRow} from "@component/FlexRow";
import * as ColorPalette from "@component/ColorPalette";


export function RetroMinimaEdgeContainer(): ReactNode {
    return <>
        <FlexCol style={{width: "300px", aspectRatio: "1/1", position: "relative"}}>
            <FlexCol style={{width: "100%", height: "100%", position: "absolute"}}>
                <FlexRow style={{width: "100%", height: "50%", justifyContent: "space-between"}}>
                    <FlexCol style={{width: "50%", height: "100%", borderLeftWidth: "1px", borderLeftStyle: "solid", borderLeftColor: ColorPalette.TITANIUM.toString(), borderTopWidth: "1PX", borderTopStyle: "solid", borderTopColor: ColorPalette.TITANIUM.toString()}}/>
                    <FlexCol style={{width: "50%", height: "100%"}}/>
                </FlexRow>
                <FlexRow style={{width: "100%", height: "50%", justifyContent: "space-between"}}>
                    <FlexCol style={{width: "50%", height: "100%"}}/>
                    <FlexCol style={{width: "50%", height: "100%"}}/>
                </FlexRow>
            </FlexCol>
            <FlexCol style={{width: "100%", height: "100%", position: "absolute"}}></FlexCol>
        </FlexCol>
    </>;
}