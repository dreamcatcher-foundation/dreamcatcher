import Layer from "./Layer.tsx";
import React from "react";

export interface IBackgroundProps {}

export default function Background(props: IBackgroundProps) {
    return (
        <Layer zIndex={"1000"}>
            <div style={{width: "100%", height: "100%", background: "#161616"}}/>
        </Layer>
    );
}