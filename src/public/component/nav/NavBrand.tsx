import { Col } from "@component/Col";
import { Image } from "@component/Image";
import { Text } from "@component/Text";
import { RelativeUnit } from "@lib/RelativeUnit";
import React from "react";

export function NavBrand(): React.JSX.Element {
    return <>
        <Col>
            <Image
            src="../../img/press-kit/Logo.png"
            style={{
                width: RelativeUnit(2),
                aspectRatio: "1/1"
            }}/>
            <Text
            text="Dreamcatcher"
            style={{
                fontSize: RelativeUnit(1.5)
            }}/>
        </Col>
    </>;
}