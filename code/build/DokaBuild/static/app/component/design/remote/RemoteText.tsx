import {stream} from "../../../core/Stream";
import RemoteCol from "./RemoteFlex";
import React, {useState, useEffect} from "react";

export interface RemoteTextProps {
    name: string;
    text?: string;
    width: string;
    height: string;
}

export default function RemoteText(props: RemoteTextProps) {
    let {
        name,
        text: textProp,
        width,
        height
    } = props;
    const [text, setText] = useState("");

    useEffect(function() {
        stream.subscribe({
            event: `${name} set text`,
            task: function(text: string) {
                setText(text);
            }
        });

        if (textProp) {
            setText(textProp);
        }
    }, []);

    return <RemoteCol name={name} width={width} height={height}/>;
}