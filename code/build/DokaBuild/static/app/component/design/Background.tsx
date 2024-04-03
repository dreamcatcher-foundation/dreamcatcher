import Layer from "./Layer.tsx";
import React from "react";

export interface IBackgroundProps {}

export function Background(props: IBackgroundProps) {
    return (
        <Layer zIndex={"1000"}>
            <div style={{background: "#161616"}}/>
        </Layer>
    );
}