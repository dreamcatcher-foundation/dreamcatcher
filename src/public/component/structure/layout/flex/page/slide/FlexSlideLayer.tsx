import type {ReactNode} from "react";
import type {FlexSlideLayerProps} from "@component/FlexSlideLayerProps";
import {FlexSlide} from "@component/FlexSlide";

export function FlexSlideLayer(props: FlexSlideLayerProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <FlexSlide
        style={{
            width: "100%",
            minWidth: "100%",
            maxWidth: "100%",
            height: "100%",
            minHeight: "100%",
            maxHeight: "100%",
            overflowX: "hidden",
            overflowY: "hidden",
            position: "absolute",
            pointerEvents: "none",
            justifyContent: "center",
            alignItems: "center",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}