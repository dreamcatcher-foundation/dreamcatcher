import type {ReactNode} from "react";
import type {FlexProps} from "src/public/component_/layout/flex/FlexProps";
import {Flex} from "src/public/component_/layout/flex/Flex";

export function FlexLayer(props: FlexProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <Flex
        style={{
            
        }}
        {... more}/>
    </>;
}