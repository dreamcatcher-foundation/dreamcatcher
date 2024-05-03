import MappedEventEmitter from "./MappedEventEmitter.ts";
import {type CSSProperties, type ReactNode} from "react";
import {type SpringConfig} from "react-spring";

export type EventsMap = {
    /** ... Action */
    setSpring: [spring: CSSProperties],
    setSpringConfig: [springConfig: SpringConfig],
    setStyle: [style: CSSProperties],
    setClassName: [className: string],
    setText: [text: string],
    toggle: [state: boolean],
    push: [component: ReactNode],
    pull: [],
    wipe: [],
    swap: [component: ReactNode],

    /** ... Events */
    CLICK: [],
    MOUSE_ENTER: [],
    MOUSE_LEAVE: [],
    INPUT_CHANGE: [input: string],
    TOGGLED: [state: boolean],
    SUBMIT: [],
    METADATA_FORM_SUBMIT: [
        DAONameField: string,
        DAOTokenNameField: string,
        DAOTokenSymbolField: string
    ]
};

export const defaultMappedEventEmitter: MappedEventEmitter<EventsMap> = new MappedEventEmitter<EventsMap>();