import React, {type ReactNode} from "react";
import Col, {type ColProps} from "../../HookableAnimatedColumn.tsx";

export type SleekObsidianContainerProps = ColProps & {
    direction?: string;
};

export default function SleekObsidianContainer(props: SleekObsidianContainerProps): ReactNode {
    const {name, style, direction, ...more} = props;
    return (
        <Col {...{
            name: name,
            style: {
                background: "#171717",
                borderWidth: "1px",
                borderStyle: "solid",
                borderImage: `linear-gradient(${direction ?? "to bottom"}, transparent, #505050) 1`,
                padding: "2.5%",
                justifyContent: "space-between",
                overflowX: "hidden",
                overflowY: "auto",
                ...style ?? {}
            },
            ...more
        }}>
        </Col>
    );
}

function PhantomSteelObsdianContainer(): ReactNode {
    
}