import {type CSSProperties} from "react";

export interface ISteelTextProps {
    text: string;
    style: CSSProperties;
}

export default function SteelText(props: ISteelTextProps) {
    const initStyle = props.style ?? {};
    const text = props.text;
    const style = {
        fontSize: "8px",
        fontFamily: "roboto mono",
        fontWeight: "bold",
        color: "white",
        background: "-webkit-linear-gradient(#FFFFFF, #A4A2A1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...initStyle
    };
    return (
        <div style={style}>{text}</div>
    );
}