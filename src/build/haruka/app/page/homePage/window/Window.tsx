import React, {type ReactNode, useEffect, useState} from "react";
import PhantomSteelFrameHook from "../../shared/component/layout/container/PhantomSteelFrameHook.tsx";
import ObsidianContainerWithPhantomSteelFrameHook from "../../shared/component/layout/container/ObsidianContainerWithPhantomSteelFrameHook.tsx";
import WelcomeSlide from "./slide/WelcomeSlide.tsx";

export default function Window(): ReactNode {
    return (
        <PhantomSteelFrameHook
        nodeKey="homePage.window.phantomSteelFrame"
        style={{
            width: "500px",
            height: "512px"
        }}>
            <ObsidianContainerWithPhantomSteelFrameHook
            nodeKey="homePage.window"
            style={{
                width: "450px",
                height: "450px"
            }}>
                <WelcomeSlide/>
            </ObsidianContainerWithPhantomSteelFrameHook>
        </PhantomSteelFrameHook>
    );
}