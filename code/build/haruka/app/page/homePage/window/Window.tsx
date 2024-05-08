import React, {type ReactNode, useEffect, useState} from "react";
import PhantomSteelFrameHook from "../../shared/components/layout/container/PhantomSteelFrameHook.tsx";
import ObsidianContainerWithPhantomSteelFrameHook from "../../shared/components/layout/container/ObsidianContainerWithPhantomSteelFrameHook.tsx";
import WelcomeSlide from "./slide/WelcomeSlide.tsx";
import {defaultMappedEventEmitter} from "../../../library/event-driven-architecture/DefaultMappedEventEmitter.ts";
import {type EventSubscription} from "fbemitter";

export default function Window(): ReactNode {
    return (
        <PhantomSteelFrameHook
        uniqueId="homePage.window.phantomSteelFrame"
        style={{
            width: "500px",
            height: "512px"
        }}>
            <ObsidianContainerWithPhantomSteelFrameHook
            uniqueId="homePage.window"
            style={{
                width: "450px",
                height: "450px"
            }}>
                <WelcomeSlide/>
            </ObsidianContainerWithPhantomSteelFrameHook>
        </PhantomSteelFrameHook>
    );
}