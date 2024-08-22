import type { ReactNode } from "react";
import { Page } from "@component/Page";
import { Layer } from "@component/Layer";
import { Nav } from "src/public/component_/nav/Nav";
import { Col } from "@component/Col";

export function PageTemplate({
    content,
    background,
    hlen = 1n,
    vlen = 1n
}:{
    content: ReactNode;
    background: ReactNode;
    hlen?: bigint;
    vlen?: bigint;
}): ReactNode {
    return <>
        <Page
        hlen={ hlen }
        vlen={ vlen }>
            <Layer>
                { background }
            </Layer>
            <Layer>
                <Nav/>
                <Col
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "start",
                    alignItems: "center"
                }}>
                    { content }
                </Col>
            </Layer>
        </Page>
    </>;
}