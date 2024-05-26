import React, {type ReactNode, useState} from "react";
import RowHook from "../layout/RowHook.tsx";
import {EventsStream} from "../../../../lib/events-emitter/EventsStream.ts";
import {config} from "react-spring";

export interface ToggleHookProps {
    uniqueId: string;
    isToggled?: boolean;
}

export default function ToggleHook(_props: ToggleHookProps): ReactNode {
    const {uniqueId, isToggled: isToggledProp} = _props;
    const [isToggled, setToggled] = useState<boolean>(isToggledProp ?? false);
    return (
        <RowHook
        nodeKey={uniqueId}
        spring={{
            width: "50px",
            height: "25px",
            background: isToggledProp ? "#615FFF" : "#202020"
        }}
        style={{
            overflowX: "hidden",
            overflowY: "hidden",
            justifyContent: "start",
            padding: "2.5px",
            borderRadius: "25px"
        }}
        onMouseEnter={function() {
            EventsStream.dispatch(uniqueId, "setSpring", {
                cursor: "pointer"
            });
        }}
        onMouseLeave={function() {
            EventsStream.dispatch(uniqueId, "setSpring", {
                cursor: "auto"
            });
        }}
        onClick={function() {
            setToggled(!isToggled);
            if (isToggled) {
                EventsStream.dispatch(`${uniqueId}.dot`, "setSpring", {left: "25px"});
                EventsStream.dispatch(uniqueId, "setSpring", {background: "#615FFF"});
                EventsStream.dispatchEvent(uniqueId, "TOGGLED", isToggled);
                return;
            }
            EventsStream.dispatch(`${uniqueId}.dot`, "setSpring", {left: "0px"});
            EventsStream.dispatch(uniqueId, "setSpring", {background: "#202020"});
            EventsStream.dispatchEvent(uniqueId, "TOGGLED", isToggled);
            return;
        }}>
            <RowHook
            nodeKey={`${uniqueId}.dot`}
            spring={{
                width: "20px",
                height: "20px",
                borderRadius: "25px",
                background: "#171717",
                position: "relative",
                left: isToggledProp ? "25px" : "0px"
            }}
            springConfig={config.stiff}/>
        </RowHook>
    );
}