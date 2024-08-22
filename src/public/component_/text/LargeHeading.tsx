import type {ReactNode} from "react";
import type {TextProps} from "src/public/component_/text/Text";
import {Text} from "src/public/component_/text/Text";

export interface LargeHeadingProps extends TextProps {}

export function LargeHeading(props: LargeHeadingProps): ReactNode {
    let {style, ... more} = props;
    return <>
        <Text
        style={{
            fontSize: 94,
            ... style
        }}
        {... more}/>
    </>;
}