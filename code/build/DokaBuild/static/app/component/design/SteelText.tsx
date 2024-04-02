import {type CSSProperties} from "react";

export interface ISteelTextProps {
    text: string;
    style: CSSProperties;
}

export default function SteelText(props: ISteelTextProps) {
    props.style = props.style ?? {};
    const style = {
        fontSize: "8px",
        fontFamily: "roboto mono",
        fontWeight: "bold",
        color: "white",
        background: "-webkit-linear-gradient(#FFFFFF, #A4A2A1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    };
    return (
        <div style={{...style, ...props.style}}>{props.text}</div>
    );
}