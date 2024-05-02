import Col, {type ColProps} from "../HookableAnimatedColumn.tsx";
import React, {type ReactNode} from "react";

export type RowProps = ColProps;

export default function Row(props: RowProps): ReactNode {
    const {name, style, ...more} = props;
    return (
        <Col {...{
            name: name,
            style: {
                flexDirection: "row",
                ...style
            },
            ...more
        }}>
        </Col>
    );
}