import React, {type ReactNode} from "react";
import Page from "../component/layout/Page.tsx";
import BackgroundLayer from "../component/layer/BackgroundLayer.tsx";
import NavUserInterfaceLayer from "../component/layer/NavUserInterfaceLayer.tsx";

export default function HomePage(): ReactNode {
    return (
        <Page name={"homePage"}>
            <BackgroundLayer></BackgroundLayer>
            <NavUserInterfaceLayer></NavUserInterfaceLayer>
        </Page>
    );
}