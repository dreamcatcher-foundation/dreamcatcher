import type {CSSProperties} from "react";
import {EventsHub} from "../Event.ts";

export const defaultEventsHub = new EventsHub<{
    /** Actions */
    "renderRemoteState": [state: bigint];
    "renderRemoteSpring": [spring: object];
    "renderRemoteStyle": [style: CSSProperties];
    "renderRemoteClassName": [className: string];
    "renderRemoteText": [text: string];
    "pushRemoteContainer": [component: React.JSX.Element];
    "pullRemoteContainer": [];
    "wipeRemoteContainer": [];
    "swapRemoteContainer": [component: React.JSX.Element];

    /** Events */
    "MouseEnter": [];
    "MouseLeave": [];
    "Click": [];
    "Input": [newValue: string];
    "ToggledOn": [];
    "ToggledOff": [];
}>();