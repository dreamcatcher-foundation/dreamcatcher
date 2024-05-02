import React, {type ReactNode} from "react";
import Col from "../../HookableAnimatedColumn.tsx";
import SleekObsidianContainer, {type SleekObsidianContainerProps} from "./SleekObsidianContainer.tsx";

export type FancyObsidianContainerProps = SleekObsidianContainerProps;

export default function FancyObsidianContainer(props: FancyObsidianContainerProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Col {...{
            name: `${name}__steelFrame`,
            style: {
                width: "500px",
                height: "512px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderImage: "linear-gradient(to bottom, transparent, #505050) 1"
            }
        }}>
            <SleekObsidianContainer {...{
                name: name,
                style: {
                    width: "450px",
                    height: "450px",
                    ...style
                },
                ...more
            }}>
            </SleekObsidianContainer>
        </Col>
    );
}