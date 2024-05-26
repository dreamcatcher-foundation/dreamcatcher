import { type ReactNode } from "react";
import { useEffect } from "react";
import { PhantomSteelFrameHook } from "@atlas/component/layout/container/PhantomSteelFrameHook.tsx";
import { ObsidianContainerWithPhantomSteelFrameHook } from "@atlas/component/layout/container/ObsidianContainerWithPhantomSteelFrameHook.tsx";
import { WelcomeSlide } from "@atlas/styled/local/home-page/window/slide/WelcomeSlide.tsx";
import React from "react";

class WindowDeploymentTracker {
    public static daoName: string = "";
    public static daoTokenName: string = "";
    public static daoTokenSymbol: string = "";
    public static selectedErc20Extension: boolean = false;
    public static selectedAuthExtension: boolean = true; /** recommended */
}

function Window(): ReactNode {

    return (
        <PhantomSteelFrameHook
        node="homePage.window.phantomSteelFrame"
        style={{
            width: "500px",
            height: "512px"
        }}>
            <ObsidianContainerWithPhantomSteelFrameHook
            node="homePage.window"
            style={{
                width: "450px",
                height: "450px"
            }}>
                <WelcomeSlide/>
            </ObsidianContainerWithPhantomSteelFrameHook>
        </PhantomSteelFrameHook>
    );
}

export { WindowDeploymentTracker };
export { Window };