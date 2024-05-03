import React, {type ReactNode, useEffect, useState} from "react";
import {BrowserProvider} from "ethers";
import {defaultMappedEventEmitter} from "../../../library/messenger/DefaultMappedEventEmitter.ts";

export default function BrowserProviderNode(): ReactNode {
    const [provider, setProvider] = useState<BrowserProvider>();
    useEffect(function() {
        [
            defaultMappedEventEmitter.hookEvent("connectButton", "CLICK", function() {

            })
        ]
    }, []);
    return (
        <div/>
    );
}