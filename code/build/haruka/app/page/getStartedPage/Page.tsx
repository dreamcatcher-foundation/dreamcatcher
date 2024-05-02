import React, {type ReactNode} from "react";
import NavbarLayer from "../shared/NavbarLayer.tsx";
import PageComponent from "../../component/layout/Page.tsx";
import Layer from "../../component/layout/Layer.tsx";

export default function Page(): ReactNode {
    return (
        <PageComponent name="page">
            <Layer name="content">
                
            </Layer>
            <NavbarLayer/>
        </PageComponent>
    );
}