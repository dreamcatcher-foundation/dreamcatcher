import { Row } from "@component/Row";
import { Col } from "@component/Col";
import { Image } from "@component/Image";
import { Text } from "@component/Text";
import { RelativeUnit } from "@lib/RelativeUnit";
import { Button } from "@component/Button";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";

export function LandingPageHeroSection(): React.JSX.Element {
    return <>
        <Row
        style={{
            width: RelativeUnit(100),
            height: "auto",
            paddingLeft: RelativeUnit(10),
            paddingRight: RelativeUnit(10),
            paddingTop: RelativeUnit(2.5),
            paddingBottom: RelativeUnit(2.5)
        }}>
            <Col
            style={{
                gap: RelativeUnit(1)
            }}>
                <Col>
                    <Row>
                        <Text
                        text="Shape the Decentralized Enterprise."
                        style={{
                            fontSize: RelativeUnit(4.5)
                        }}/>
                    </Row>

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
                </Col>

                <Row
                style={{
                    width: "100%",
                    justifyContent: "start",
                    gap: RelativeUnit(2)
                }}>
                    <Button
                    label="Test Button"
                    borderColor={ ColorPalette.DEEP_PURPLE.toString() }/>
                    <Button
                    label="Learn More"
                    borderColor={ ColorPalette.GHOST_IRON.toString() }/>
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