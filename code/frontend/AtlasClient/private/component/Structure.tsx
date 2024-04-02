import {type CSSProperties} from "react";

export function Col({
    w, 
    h, 
    style, 
    children}: {
        w: string; 
        h: string; 
        style?: CSSProperties; 
        children?: JSX.Element | (JSX.Element)[];}) {
    return (
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: w,
            height: h,
            ...style ?? {}
        }}>
        {children}
        </div>
    );
}

export function Row({
    w, 
    h, 
    style, 
    children}: {
        w: string; 
        h: string; 
        style?: CSSProperties; 
        children?: JSX.Element | (JSX.Element)[];}) {
    return (
        <div
        style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: w,
            height: h,
            ...style ?? {}
        }}>
        {children}
        </div>
    );
}

export function Page({
    children}: {
        children?: JSX.Element | (JSX.Element)[];}) {
    return (
        <Col
        w="100vw"
        h="100vh">
        {children}
        </Col>
    );
}

export function Slide({
    layer, 
    children}: {
        layer: string; 
        children?: JSX.Element | (JSX.Element)[];}) {
    return (
        <Col
        w="100%"
        h="100%"
        style={{
            position: "absolute",
            zIndex: layer
        }}>
        {children}
        </Col>
    );
}