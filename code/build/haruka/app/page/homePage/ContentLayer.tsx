import React, {type ReactNode} from "react";
import Layer from "../../component/layout/Layer.tsx";
import Window from "./HomePageWindow.tsx";

export default function ContentLayer(): ReactNode {
    return (
        <Layer name="contentLayer">
            <Window/>
        </Layer>
    );
}