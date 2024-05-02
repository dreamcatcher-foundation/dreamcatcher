import React, {type ReactNode} from "react";
import Logo from "./Logo.tsx";

export default function BrandNameAndLogo(): ReactNode {
    return (
        <div
        style={{
        width: "170px",
        height: "60px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderImage: "linear-gradient(to bottom, transparent, #505050) 1"
        }}>
            <div
            style={{
            width: "auto",
            height: "auto",
            position: "relative",
            bottom: "12.5px"
            }}>
                <Logo/>
            </div>
            <div
            style={{
            fontSize: "20px",
            fontFamily: "roboto mono",
            fontWeight: "bold",
            color: "white",
            background: "#D6D5D4",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            position: "relative",
            bottom: "12.5px"
            }}>
                Dreamcatcher
            </div>
        </div>
    );
}