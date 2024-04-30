import type {ReactNode} from "react";
import type {RenderedColumnProps} from "../rendered/RenderedColumn.tsx";
import RenderedColumn from "../rendered/RenderedColumn.tsx";

export type SleekObsidianContainerProps = RenderedColumnProps;

export default function SleekObsidianContainer(props: SleekObsidianContainerProps): ReactNode {
    let {style, ...more} = props;
    return <RenderedColumn {...{
        style: {
            background: "#171717",
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "linear-gradient(to bottom, transparent, #505050) 1",
            padding: "2.5%",
            justifyContent: "space-between",
            overflowX: "hidden",
            overflowY: "auto",
            ...style ?? {}
        },
        ...more
    }}>
    </RenderedColumn>;
}