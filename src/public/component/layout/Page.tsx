import type { ColProps } from "@component/Col";
import { Col } from "@component/Col";
import React from "react";

export interface PageProps extends ColProps {
    hlen?: bigint;
    vlen?: bigint;
}

export function Page(props: PageProps): React.JSX.Element {
    let { hlen, vlen, style, ... more } = props;
    hlen = hlen ?? 1n;
    vlen = vlen ?? 1n;
    let hlenNum: number = Number(hlen);
    let vlenNum: number = Number(vlen);
    let hvw: number = hlenNum * 100;
    let vvh: number = vlenNum * 100;
    let width: string = `${hvw}vw`;
    let height: string = `${vvh}vh`;
    return <>
        <Col
        style={{
            width: width,
            height: height,
            overflow: "hidden",
            pointerEvents: "none",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}