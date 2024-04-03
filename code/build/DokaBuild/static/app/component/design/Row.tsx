import {type CSSProperties} from "react";

export interface IRowProps {
    width: string;
    height: string;
    style?: CSSProperties;
    children?: JSX.Element | (JSX.Element)[]; 
}

export default function Row(props: IRowProps) {
    const width = props.width;
    const height = props.height;
    const initStyle = props.style ?? {};
    const children = props.children;
    const style = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: width,
        height: height,
        ...initStyle
    };
    return (
        <div style={style as any} children={children}/>
    );
}