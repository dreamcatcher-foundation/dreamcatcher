import React, {type ReactNode} from "react";
import FancyObsidianContainer from "../layout/container/FancyObsidianContainer.tsx";
import Text from "../text/Text.tsx";

export default function HomePageObsidianWindow(): ReactNode {
    return (
        <FancyObsidianContainer 
        name={"homePageObsidianWindow"}
        style={{
        justifyContent: "start"
        }}>
            <Text
            name={"homePageObsidianWindowHeading"}
            text={"Scaling Dreams, Crafting Possibilities"}
            style={{
            fontSize: "40px",
            background: "#615FFF"
            }}/>
            <Text
            name={"homePageObsidianWindowSubHeading"}
            text={"Entrepreneurs Wanted"}
            style={{
            fontSize: "20px"
            }}/>
        </FancyObsidianContainer>
    );
}