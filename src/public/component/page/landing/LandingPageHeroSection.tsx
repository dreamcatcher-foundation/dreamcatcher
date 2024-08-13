import { Row } from "@component/Row";
import { Col } from "@component/Col";
import { Image } from "@component/Image";
import { Text } from "@component/Text";
import { RelativeUnit } from "@lib/RelativeUnit";
import { LandingPageLearnMoreButton } from "./LandingPageLearnMoreButton";
import React from "react";

export function LandingPageHeroSection(): React.JSX.Element {
    return <>
        <Row
        style={{
            width: RelativeUnit(100),
            height: "auto",
            padding: RelativeUnit(5)
        }}>
            <Col>
                <Text
                text="Shape the Decentralized Enterprise."
                style={{
                    fontSize: RelativeUnit(5)
                }}/>
                <Row
                style={{
                    width: "100%",
                    height: "auto",
                    justifyContent: "start"
                }}>
                    <Text
                    text="Launch your space-proof code for your autonomous systems."
                    style={{
                        fontSize: RelativeUnit(2)
                    }}/>
                </Row>
                <Row>
                    <LandingPageLearnMoreButton/>
                </Row>
            </Col>
            <Image
            src="../../../img/shape/Stripe.svg"
            style={{
                width: RelativeUnit(25),
                aspectRatio: "1/1"
            }}/>
        </Row>
    </>;
}