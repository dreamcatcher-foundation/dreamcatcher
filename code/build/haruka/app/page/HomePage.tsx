import {type ReactNode} from "react";
import BackgroundLayer from "../component/item/BackgroundLayer.tsx";
import HomePageWindow from "../component/item/HomePageWindow.tsx";
import NavLayer from "../component/item/NavLayer.tsx";
import Page from "../component/layout/Page.tsx";
import Layer from "../component/layout/Layer.tsx";

export default function HomePage(): ReactNode {
    return (
        <Page name={"homePage"}>
            <BackgroundLayer/>

            <Layer name="homePageContentLayer">
                <HomePageWindow/>
            </Layer>
            
            <NavLayer/>
        </Page>
    );
}