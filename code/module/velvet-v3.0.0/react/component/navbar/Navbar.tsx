import type {ReactNode} from "react";
import type {RenderedRowProps} from "../rendered/RenderedRow.tsx";
import RenderedRow from "../rendered/RenderedRow.tsx";

export type NavbarProps = RenderedRowProps;

export default function Navbar(props: RenderedRowProps): ReactNode {
    let {style, ...more} = props;
    return <RenderedRow {...{
        style: {
            width: "auto",
            height: "auto",
            gap: "30px",
            ...style ?? {}
        },
        ...more
    }}>
    </RenderedRow>;
}