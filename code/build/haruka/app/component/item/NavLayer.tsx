import React, {type ReactNode} from "react";
import Nav from "./Nav.tsx";
import Layer from "../layout/Layer.tsx";

export default function NavLayer(): ReactNode {
    return (
        <Layer
        name="navLayer"
        style={{
        justifyContent: "start",
        paddingTop: "20px",
        pointerEvents: "none"
        }}>
            <Nav/>
        </Layer>
    );
}