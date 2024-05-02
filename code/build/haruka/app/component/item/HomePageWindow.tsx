import React, {type ReactNode} from "react";
import FancyObsidianContainer from "../layout/container/FancyObsidianContainer";
import Text from "../text/Text";
import Toggle from "../input/Toggle.tsx";

export default function HomePageWindow(): ReactNode {
    return (
        <FancyObsidianContainer
        name="homePageWindow"
        style={{
        justifyContent: "start"
        }}>
            <Text
            name="homePageWindowHeading"
            text="Scaling Dreams, Crafting Prossibilities"
            style={{
            fontSize: "40px",
            background: "#615FFF"
            }}/>

            <Text
            name="homePageWindowSubHeading"
            text="Deploy next gen protocols."
            style={{
            fontSize: "20px"
            }}/>

            <Toggle
            name="t"
            isToggled={false}/>
        </FancyObsidianContainer>
    );
}