import React, {type ReactNode, useState} from "react";
import Row from "../layout/Row.tsx";
import Col from "../HookableAnimatedColumn.tsx";
import {defaultMappedEventEmitter} from "../../lib/messenger/DefaultMappedEventEmitter.ts";
import {config} from "react-spring";
import Text from "../text/Text.tsx";

export default function GetStartedPageInstallationOptionItem({
    name,
    quirkName,
    isToggled: pIsToggled
}: {
    name: string;
    quirkName: string;
    isToggled?: boolean;
}): ReactNode {
    const [isToggled, toggle] = useState<boolean>(pIsToggled ?? false);
    return (
        <Row 
        name={`${name}__wrapper`} 
        style={{
        width: "400px",
        height: "25px"
        }}>
            <Row 
            name={`${name}__toggleButton`}
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
            borderRadius: "25px",
            gap: "20px"
            }} 
            onMouseEnter={function() {
            defaultMappedEventEmitter.post(`${name}__wrapper`, "setSpring", {
                cursor: "pointer"
            });
            }} 
            onMouseLeave={function() {
            defaultMappedEventEmitter.post(`${name}__wrapper`, "setSpring", {
                cursor: "auto"
            });
            }} 
            onClick={function() {
            if (isToggled) {
                toggle(false);
                defaultMappedEventEmitter.post(`${name}__toggleButtonDot`, "setSpring", {
                    left: "25px"
                });
                defaultMappedEventEmitter.post(`${name}__toggleButton`, "setSpring", {
                    background: "#615FFF"
                });
                defaultMappedEventEmitter.postEvent(name, "TOGGLED", false);
            }
            else {
                toggle(true)
                defaultMappedEventEmitter.post(`${name}__toggleButtonDot`, "setSpring", {
                    left: "0px"
                });
                defaultMappedEventEmitter.post(`${name}__toggleButton`, "setSpring", {
                    background: "#FF1802"
                });
                defaultMappedEventEmitter.postEvent(name, "TOGGLED", true);
            }
            }}>
                <Col 
                name={`${name}__toggleButtonDot`} 
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

            <Text 
            name={`${name}__label`} 
            text={quirkName}/>
        </Row>
    );
}