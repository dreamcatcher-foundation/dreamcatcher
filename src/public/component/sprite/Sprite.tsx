import type {ReactNode} from "react";
import type {SpriteProps} from "@component/SpriteProps";
import {Base} from "@component/Base";

export function Sprite(props: SpriteProps): ReactNode {
    let {src, style, ... more} = props;
    return <>
        <Base
        style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            ... style ?? {}
        }}
        {... more}/>
    </>;
}