import type {ReactNode} from "react";
import type {ColProps} from "@component/Col";
import {Col} from "@component/Col";

export function FlexFill(): ReactNode {
    return <>
        <Col
            style={{
                width: "100%",
                height: "100%"
            }}/>
    </>;
}

