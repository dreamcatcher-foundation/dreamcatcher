import React, {type ReactNode} from "react";
import Col from "../HookableAnimatedColumn.tsx";
import GetStartedPageInstallationOptionItem from "./GetStartedPageInstallationOptionItem.tsx";

export default function GetStartedPageInstallationForm(): ReactNode {
    return (
        <Col
        name="installationForm"
        style={{
        width: "420px",
        height: "300px",
        overflowY: "scroll",
        overflowX: "hidden",
        pointerEvents: "auto"
        }}>
            <GetStartedPageInstallationOptionItem
            name="option0"
            quirkName="ERC20"/>
        </Col>
    );
}