import { type ReactNode } from "react";
import { useState } from "react";
import { Stream } from "@atlas/shared/com/Stream.ts";
import { RowHook } from "@atlas/component/layout/RowHook.tsx";
import { config } from "react-spring";
import React from "react";

interface IToggleHookProps {
    node: string;
    isToggled?: boolean;
}

function ToggleHook(props: IToggleHookProps): ReactNode {
    let { node, isToggled: isToggledProp} = props;
    let [isToggled, setToggled] = useState<boolean>(isToggledProp ?? false);
    return (
        <RowHook
        node={node}
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
        onMouseEnter={() => Stream.dispatch({toNode: node, command: "setSpring", item: {cursor: "pointer"}})}
        onMouseLeave={() => Stream.dispatch({toNode: node, command: "setSpring", item: {cursor: "auto"}})}
        onClick={function() {
            setToggled(!isToggled);
            if (isToggled) {
                Stream.dispatch({toNode: `${node}.dot`, command: "setSpring", item: {left: "25px"}});
                Stream.dispatch({toNode: node, command: "setSpring", item: {background: "#615FFF"}});
                Stream.dispatchEvent({fromNode: node, event: "toggle", item: isToggled});
                return;
            }
            Stream.dispatch({toNode: `${node}.dot`, command: "setSpring", item: {left: "0px"}});
            Stream.dispatch({toNode: node, command: "setSpring", item: {background: "#202020"}});
            Stream.dispatchEvent({fromNode: node, event: "toggle", item: isToggled});
            return;
        }}>
            <RowHook
            node={`${node}.dot`}
            spring={{
                width: "20px",
                height: "20px",
                borderRadius: "25px",
                background: "#171717",
                position: "relative",
                left: isToggledProp ? "25px" : "0px"
            }}
            springConfig={config.stiff}>
            </RowHook>
        </RowHook>
    );
}

export { type IToggleHookProps };
export { ToggleHook };