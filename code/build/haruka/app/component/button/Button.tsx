import React, {type ReactNode} from "react";
import Row, {type RowProps} from "../layout/Row.tsx";
import {defaultMappedEventEmitter} from "../../lib/messenger/DefaultMappedEventEmitter.ts";
import {config} from "react-spring";

export type ButtonProps = RowProps;

export default function Button(props: ButtonProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Row
        name={name}
        style={{
        width: "200px",
        height: "50px",
        overflowX: "hidden",
        overflowY: "hidden"
        }}
        spring={{
        background: "#615FFF"
        }}
        springConfig={config.slow}
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
        {...more}/>
    );
}