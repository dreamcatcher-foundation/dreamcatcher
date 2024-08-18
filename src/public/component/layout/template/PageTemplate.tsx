import type { ReactNode } from "react";
import { Page } from "@component/Page";
import { Layer } from "@component/Layer";
import { Nav } from "@component/Nav";
import { Col } from "@component/Col";

export function PageTemplate({
    content,
    background
}:{
    content: ReactNode;
    background: ReactNode;
}): ReactNode {
    return <>
        <Page
        hlen={ 1n }
        vlen={ 1n }>
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