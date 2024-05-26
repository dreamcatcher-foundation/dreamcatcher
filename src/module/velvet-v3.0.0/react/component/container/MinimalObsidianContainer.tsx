import type {ReactNode} from "react";
import type {SleekObsidianContainerProps} from "./SleekObsidianContainer.tsx";
import SleekObsidianContainer from "./SleekObsidianContainer.tsx";

export type MinimalObsidianContainerProps = SleekObsidianContainerProps;

export default function MinimalObsidianContainer(props: MinimalObsidianContainerProps): ReactNode {
    let {style, ...more} = props;
    return <SleekObsidianContainer {...{
        style: {
            borderImage: "none",
            borderColor: "#505050",
            ...style ?? {}
        },
        ...more
    }}>
    </SleekObsidianContainer>;
}