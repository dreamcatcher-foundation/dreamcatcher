import type { ReactNode } from "react";
import { PageTemplate } from "@component/PageTemplate";
import { LandingPageBackground } from "./LandingPageBackground";
import { LandingPageHeroSection } from "./LandingPageHeroSection";

export function LandingPage(): ReactNode {
    return <>
        <PageTemplate
        content={ <LandingPageHeroSection/> }
        background={ <LandingPageBackground/> }/>
    </>;
}