import type {CSSProperties} from "react";

export type RenderArgs = ({
    toSocket: string;
    className?: string;
    spring?: object;
    style?: CSSProperties;
    text?: string;
});