import React, {type ReactNode} from "react";
import TextInput from "../../components/input/TextInput.tsx";
import Col from "../../components/layout/Col.tsx";

export default function GetStartedPageMetadataForm(): ReactNode {
    return (
        <Col name="getStartedPageTextInputForm">
            <TextInput
            name="getStartedPageTextInputForm__input0"
            placeholder="Community, DAO, or project name"/>

            <TextInput
            name="getStartedPageTextInputForm__input1"
            placeholder="Token name"/>

            <TextInput
            name="getStartedPageTextInputForm__input2"
            placeholder="Token symbol"/>
        </Col>
    );
}