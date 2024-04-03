import Col from "./Col.tsx";
import React from "react";

export interface IPageProps {
    children?: JSX.Element | (JSX.Element)[];
}

export default function Page(props: IPageProps) {
    const children = props.children;
    return (
        <Col width={"100vw"} height={"100vh"} children={children}/>
    );
}