import type {CSSProperties} from "react";
import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {defaultEventsHub} from "../../event/hub/DefaultEventsHub.ts";
import {EventSubscription} from "fbemitter";
import Remote from "./Remote.tsx";

export default function RemoteText({
    remoteId,
    remoteText,
    remoteClassName,
    remoteSpring,
    remoteSpringConfig,
    remoteStyle,
    ...more
}: {
    remoteId: string;
    remoteText?: string;
    remoteClassName?: string;
    remoteSpring?: object;
    remoteSpringConfig?: object;
    remoteStyle?: CSSProperties;
    [key: string]: any;
}): React.JSX.Element {
    const [text, setText] = useState<string>(remoteText ?? "");
    useEffect(function() {
        const sub0: EventSubscription = defaultEventsHub.hook(remoteId, "renderRemoteText", (text: string) => setText(text));
        return function() {
            sub0.remove();
            return;
        }
    }, []);
    return (
        <Remote {...{
            "remoteId": remoteId,
            "remoteClassName": remoteClassName,
            "remoteSpring": remoteSpring,
            "remoteSpringConfig": remoteSpringConfig,
            "remoteStyle": {
                "fontSize": "em",
                "fontFamily": "roboto mono",
                "fontWeight": "bold",
                "color": "white",
                "background": "#D6D5D4",
                "WebkitBackgroundClip": "text",
                "WebkitTextFillColor": "transparent"
            },
            ...more
        }}>
            <div>
                {text}
            </div>
        </Remote>
    );
}