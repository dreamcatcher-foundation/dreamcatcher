import React, {type ReactNode} from "react";
import Col from "../layout/Col.tsx";
import Row from "../layout/Row.tsx";
import {defaultMappedEventEmitter} from "../../lib/messenger/DefaultMappedEventEmitter.ts";

setInterval(function() {
    defaultMappedEventEmitter.post("eyeInnerCircle", "setSpring", {
        left: "-10px",
        bottom: "-10px"
    });
}, 4000);

setInterval(function() {
    defaultMappedEventEmitter.post("eyeInnerCircle", "setSpring", {
        left: "10px",
        bottom: "10px"
    });
}, 8000);

setInterval(function() {
    defaultMappedEventEmitter.post("eyeInnerCircle", "setSpring", {
        width: "60%",
        height: "60%"
    });
}, 5000);

setInterval(function() {
    defaultMappedEventEmitter.post("eyeInnerCircle", "setSpring", {
        width: "50%",
        height: "50%"
    });
}, 7000);

export default function Eye(): ReactNode {
    return (
        <Col 
        name="eyeWrapper"
        style={{
        width: "200px",
        height: "200px",
        overflow: "hidden",
        justifyContent: "start"
        }}>
            <Col
            name="eyeCircle"
            style={{
            width: "100px",
            height: "100px",
            background: "#615FFF",
            position: "absolute",
            zIndex: "200",
            }}>
                <Col
                name="eyeInnerCircle"
                spring={{
                    left: "10px",
                    bottom: "10px",
                    width: "50%",
                    height: "50%"
                }}
                style={{
                    position: "relative",

                    background: "#171717"
                }}/>
            </Col>
        </Col>
    );
}