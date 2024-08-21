import type {ReactNode} from "react";
import {Row} from "@component/Row";
import {Col} from "@component/Col";

export function LandingPageHeroSectionLayout({
    wrapperW,
    wrapperH,
    heading,
    headingColor,
    headingFontSize,
    headingFontWeight,
    headingFontFamily
}: {
    heading: string;
    headingColor: string;
    headingFontSize: string;
    headingFontWeight: string;
    headingFontFamily: string;
}): ReactNode {
    return <>
        <Row
            style={{
                width: wrapperW,
                height: wrapperH
            }}>
            <Col
                style={{
                    width: "auto",
                    height: "100%"
                }}>
                <Row
                    style={{
                        width: ""
                    }}>
                    <Text/>
                </Row>
                <Row><Text/></Row>
                <Row>

                </Row>
            </Col>
        </Row>
    </>;
}