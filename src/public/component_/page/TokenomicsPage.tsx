import type { ReactNode } from "react";
import { Col } from "@component/Col";
import { Row } from "@component/Row";
import { Text } from "src/public/component_/text/Text";
import { PagePreConnectTemplate } from "src/public/component_/layout/template/PagePreConnectTemplate";
import { useState } from "react";
import * as ColorPalette from "src/public/component_/config/ColorPalette";

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