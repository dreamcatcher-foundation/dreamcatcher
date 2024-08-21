import type {ReactNode} from "react";
import type {TextProps} from "@component/Text";
import {Text} from "@component/Text";

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