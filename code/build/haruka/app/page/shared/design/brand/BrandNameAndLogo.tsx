import React, {type ReactNode} from "react";
import Column from "../../components/layout/Column.tsx";
import Text from "../../components/text/Text.tsx";

export default function BrandNameAndLogo(): ReactNode {
    return (
        <Column
        style={{
            width: "170px",
            height: "60px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderImage: "linear-gradient(to bottom, transparent, #505050) 1"
        }}>
            <Column
            style={{
                width: "25px",
                height: "25px",
                backgroundImage: "url('../../../../../image/SteelLogo.png')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                position: "relative",
                bottom: "12.5px"
            }}/>

            <Text
            text="Dreamcatcher"
            style={{
                fontSize: "20px",
                fontFamily: "roboto mono",
                fontWeight: "bold",
                color: "white",
                background: "#D6D5D4",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                position: "relative",
                bottom: "12.5px"
            }}/>
        </Column>
    );
}