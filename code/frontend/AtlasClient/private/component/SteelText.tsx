import {type CSSProperties} from "react";

export function SteelText({text, stylesheet}: {text: string, stylesheet?: CSSProperties}) {
    stylesheet = stylesheet ?? {};
    return (
        <div
            style={{...{
                fontSize: "8px",
                fontFamily: "roboto mono",
                fontWeight: "bold",
                color: "white",
                background: "-webkit-linear-gradient(#FFFFFF, #A4A2A1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            }, ...stylesheet}}>
            {text}
        </div>
    );
}