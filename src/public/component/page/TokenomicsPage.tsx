import type { ReactNode } from "react";
import { Col } from "@component/Col";
import { Row } from "@component/Row";
import { Text } from "@component/Text";
import { PagePreConnectTemplate } from "@component/PagePreConnectTemplate";
import { useState } from "react";
import * as ColorPalette from "@component/ColorPalette";

export function TokenomicsPage(): ReactNode {
    return <>
        <PagePreConnectTemplate
        content={ <TokenomicsPageContent/> }
        background={ <TokenomicsPageBackground/> }/>
    </>;
}

export function TokenomicsPageContent(): ReactNode {
    let [totalSupply, setTotalSupply] = useState<number>(0);
    return <>
        
    </>;
}

export function TokenomicsPageBackground(): ReactNode {
    return <>
        <Col
        style={{
            width: "100%",
            height: "100%",
            background: ColorPalette.OBSIDIAN.toString()
        }}/>
    </>;
}