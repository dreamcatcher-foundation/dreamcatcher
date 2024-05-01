import React, {type ReactNode} from "react";
import Row, {type RowProps} from "../Row.tsx";

export type NavbarProps = RowProps;

export default function Navbar(props: RowProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Row {...{
            name: name,
            style: {
                width: "auto",
                height: "auto",
                gap: "30px",
                ...style ?? {}
            },
            ...more
        }}>
        </Row>
    );
}