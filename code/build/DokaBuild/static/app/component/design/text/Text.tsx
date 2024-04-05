import React, {type CSSProperties} from "react";
export default function SteelText({text, color = "-webkit-linear-gradient(#FFFFFF, #A4A2A1)", style = {}}: {text: string; color?: string; style?: CSSProperties;}) {
    style = {
        fontSize: "8px",
        fontFamily: "roboto mono",
        fontWeight: "bold",
        color: "white",
        background: color,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style
    };
    return <div style={style} children={text}/>
}