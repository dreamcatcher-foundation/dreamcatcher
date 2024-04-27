import type {CSSProperties} from "react";
import React from "react";
import {defaultEventsHub} from "../../../event/hub/DefaultEventsHub.ts";
import Row from "../base/Row.tsx";

export default function TextInput({
    address,
    placeholder,
    ...more}: {
        address: string;
        placeholder?: string;
        [key: string]: any;
}): React.JSX.Element {
    return <Row {...{
        "style": {
            "width": "100%",
            "height": "100%",
            "display": "flex",
            "flexDirection": "row",
            "justifyContent": "start",
            "alignItems": "center",
            "fontSize": "8px",
            "color": "white"
        },
        "children": [
            <input {...{
                "style": {
                    "width": "100%",
                    "height": "auto",
                    "borderWidth": "1px",
                    "borderStyle": "solid",
                    "borderColor": "#5B5B5B",
                    "background": "#161616",
                    "fontSize": "15px",
                    "fontFamily": "roboto mono",
                    "fontWeight": "bold",
                    "color": "white",
                    "padding": "12px",
                    "textShadow": "4px 4px 64px 8px #FFFFFF"
                },
                "placeholder": placeholder ?? "",
                "onChange": (event: any) => defaultEventsHub.post(address, "Input", event.target.value)
            }}/>
        ],
        ...more
    }}/>
}
