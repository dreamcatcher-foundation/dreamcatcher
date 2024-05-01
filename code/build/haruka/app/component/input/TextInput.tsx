import React, {type ReactNode} from "react";
import Row, {type RowProps} from "../layout/Row.tsx";
import {defaultMappedEventEmitter} from "../../lib/messenger/DefaultMappedEventEmitter.ts";

export type TextInputProps = RowProps & {
    placeholder?: string;
};

export default function TextInput(props: TextInputProps): ReactNode {
    const {name, placeholder, ...more} = props;
    return (
        <Row {...{
            name: name,
            style: {
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
                alignItems: "center",
                fontSize: "8px",
                color: "white"
            },
            ...more
        }}>
            <input {...{
                style: {
                    width: "100%",
                    height: "auto",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#5B5B5B",
                    background: "#161616",
                    fontSize: "15px",
                    fontFamily: "roboto mono",
                    fontWeight: "bold",
                    color: "white",
                    padding: "12px",
                    textShadow: "4px 4px 64px 8px #FFFFFF"
                },
                placeholder: placeholder,
                onChange: (event: any) => defaultMappedEventEmitter.postEvent(name, "INPUT_CHANGE", event.target.value)
            }}>
            </input>
        </Row>
    );
}