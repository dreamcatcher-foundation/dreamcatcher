import React, {type ReactNode} from "react";

export default function Logo(): ReactNode {
    return (
        <div
        style={{
        width: "25px",
        height: "25px",
        backgroundImage: "url('../../image/SteelLogo.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat"
        }}/>
    );
}