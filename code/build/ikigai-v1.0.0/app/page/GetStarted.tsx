import React from "react";
import {Page, Layer} from "../component/Base.tsx";
import {RetroMinimaTaggedContainer} from "../component/RetroMinima.tsx";

export default function GetStarted() {
    return (
        <Page>
            <Layer>
                <RetroMinimaTaggedContainer {...({
                    nodeId: "m",
                    wrapperWidth: "300px",
                    wrapperHeight: "150px",
                    tagInitialText: "Settings"
                })}></RetroMinimaTaggedContainer>
            </Layer>
        </Page>
    );
}