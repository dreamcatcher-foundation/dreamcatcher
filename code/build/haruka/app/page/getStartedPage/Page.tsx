import React, {type ReactNode} from "react";
import NavbarLayer from "../../components/NavbarLayer.tsx";
import PageComponent from "../../components/layout/Page.tsx";
import Layer from "../../components/layout/Layer.tsx";

export default function Page(): ReactNode {
    return (
        <PageComponent name="page">
            <Layer name="content">
                
            </Layer>
            <NavbarLayer/>
        </PageComponent>
    );
}