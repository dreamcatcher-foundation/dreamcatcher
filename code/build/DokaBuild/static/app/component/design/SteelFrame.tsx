import {type CSSProperties} from "react";

export interface ISteelFrameProps {
    width: string;
    height: string;
    direction: string;
    style?: CSSProperties;
    children?: JSX.Element | (JSX.Element)[];
}

export default function SteelFrame(props: ISteelFrameProps) {
    props.style = props.style ?? {}; 
    const style: CSSProperties = {
        width: props.width,
        height: props.height,
        borderWidth: "1px",
        borderStyle: "solid",
        borderImage: `linear-gradient(to ${props.direction}, transparent, #505050) 1`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    };
    return (
        <div style={{...style, ...props.style}}></div>
    );
}