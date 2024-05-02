import React, {type ReactNode, useState} from "react";
import Row from "../layout/Row.tsx";
import Col from "../HookableAnimatedColumn.tsx";
import {defaultMappedEventEmitter} from "../../lib/messenger/DefaultMappedEventEmitter.ts";
import {config} from "react-spring";

export default function Toggle({
    name,
    isToggled: pIsToggled
}: {
    name: string,
    isToggled: boolean
}): ReactNode {
    const [isToggled, toggle] = useState<boolean>(pIsToggled ?? false);
    return (
        <Row
        name={name}
        spring={{
        width: "50px",
        height: "25px",
        background: pIsToggled ? "#615FFF" : "#FF1802"
        }}
        style={{
        overflowX: "hidden",
        overflowY: "hidden",
        justifyContent: "start",
        padding: "2.5px",
        borderRadius: "25px"
        }}
        onMouseEnter={function() {
            defaultMappedEventEmitter.post(name, "setSpring", {
                cursor: "pointer"
            });
        }}
        onMouseLeave={function() {
            defaultMappedEventEmitter.post(name, "setSpring", {
                cursor: "auto"
            });
        }}
        onClick={function() {
            if (isToggled) {
                toggle(false);
                defaultMappedEventEmitter.post(`${name}__dot`, "setSpring", {
                    left: "25px"
                });
                defaultMappedEventEmitter.post(name, "setSpring", {
                    background: "#615FFF"
                });
            }
            else {
                toggle(true)
                defaultMappedEventEmitter.post(`${name}__dot`, "setSpring", {
                    left: "0px"
                });
                defaultMappedEventEmitter.post(name, "setSpring", {
                    background: "#FF1802"
                });
            }
        }}>
            <Col
            name={`${name}__dot`}
            spring={{
            width: "20px",
            height: "20px",
            borderRadius: "25px",
            background: "#171717",
            position: "relative",
            left: pIsToggled ? "25px" : "0px"
            }}
            springConfig={config.stiff}/>
        </Row>
    );
}