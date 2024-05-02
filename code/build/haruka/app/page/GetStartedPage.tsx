import React, {type ReactNode} from "react";
import NavLayer from "../component/item/NavLayer.tsx";
import Page from "../component/layout/Page.tsx";
import Layer from "../component/layout/Page.tsx";
import GetStartedPageTextInputForm from "../component/item/GetStartedPageTextInputForm.tsx";
import GetStartedPageInstallationForm from "../component/item/GetStartedPageInstallationForm.tsx";

export default function GetStartedPage(): ReactNode {
    return (
        <Page name="getStartedPage">
            <Layer name="getStartedPageContentLayer">
                <GetStartedPageTextInputForm/>

                <GetStartedPageInstallationForm/>
            </Layer>

            <NavLayer/>
        </Page>
    );
}