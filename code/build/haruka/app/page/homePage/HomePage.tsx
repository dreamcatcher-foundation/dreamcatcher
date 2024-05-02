import React, {type ReactNode} from "react";
import BackgroundLayer from "../shared/BackgroundLayer.tsx";
import NavbarLayer from "../shared/NavbarLayer.tsx";
import ContentLayer from "./ContentLayer.tsx";
import PageComponent from "../../component/layout/Page.tsx";

export default function Page(): ReactNode {
    return (
        <PageComponent name="page">
            <BackgroundLayer/>

            <ContentLayer/>

            <NavbarLayer/>
        </PageComponent>
    );
}