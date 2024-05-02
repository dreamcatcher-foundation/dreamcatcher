import React, {type ReactNode} from "react";
import Navbar from "./Navbar.tsx";
import Layer from "../../component/layout/Layer.tsx";

export default function NavLayer(): ReactNode {
    return (
        <Layer
        name="navbarLayer"
        style={{
        justifyContent: "start",
        paddingTop: "20px",
        pointerEvents: "none"
        }}>
            <Navbar/>
        </Layer>
    );
}