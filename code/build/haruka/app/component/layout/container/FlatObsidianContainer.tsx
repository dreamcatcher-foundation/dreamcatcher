import React, {type ReactNode} from "react";
import SleekObsidianContainer, {type SleekObsidianContainerProps} from "./SleekObsidianContainer.tsx";

export type FlatObsidianContainerProps = SleekObsidianContainerProps;

export default function FlatObsidianContainer(props: FlatObsidianContainerProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <SleekObsidianContainer {...{
            name: name,
            style: {
                borderImage: "none",
                borderColor: "#505050",
                ...style ?? {}
            },
            ...more
        }}>
        </SleekObsidianContainer>
    );
}