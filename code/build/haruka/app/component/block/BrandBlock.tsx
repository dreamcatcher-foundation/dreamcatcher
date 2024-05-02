import React, {type ReactNode} from "react";
import Col from "../layout/Col.tsx";
import Text from "../text/Text.tsx";

export default function BrandBlock(): ReactNode {
    return (
        <Col {...{
            name: "brandBlockWrapper",
            style: {
                width: "170px",
                height: "60px",
                borderStyle: "solid",
                borderWidth: "1px",
                borderImage: "linear-gradient(to bottom, transparent, #505050) 1"
            }
        }}>
            <div {...{
                style: {
                    width: "25px",
                    height: "25px",
                    backgroundImage: "url('../../image/SteelLogo.png')",
                    backgroundSize: "contain",
                    position: "relative",
                    bottom: "12.5px"
                }
            }}>
            </div>
            <Text {...{
                name: "brandBlockBrandName",
                text: "Dreamcatcher",
                style: {
                    fontSize: "20px",
                    position: "relative",
                    bottom: "12.5px"
                }
            }}>
            </Text>
        </Col>
    );
}