import type {ReactNode} from "react";
import RenderedPage from "../../../../module/velvet-v3.0.0/react/component/rendered/RenderedPage.tsx";
import RenderedLayer from "../../../../module/velvet-v3.0.0/react/component/rendered/RenderedLayer.tsx";
import Pulse0 from "../../../../module/velvet-v3.0.0/react/component/effect/Pulse0.tsx";
import Pulse1 from "../../../../module/velvet-v3.0.0/react/component/effect/Pulse1.tsx";
import BlurDot0 from "../../../../module/velvet-v3.0.0/react/component/effect/BlurDot0.tsx";
import BlurDot1 from "../../../../module/velvet-v3.0.0/react/component/effect/BlurDot1.tsx";
import RenderedRow from "../../../../module/velvet-v3.0.0/react/component/rendered/RenderedRow.tsx";
import Navbar from "../../../../module/velvet-v3.0.0/react/component/navbar/Navbar.tsx";
import NavbarItem from "../../../../module/velvet-v3.0.0/react/component/navbar/NavbarItem.tsx";
import ConnectButton from "../../../../module/velvet-v3.0.0/react/component/button/ConnectButton.tsx";

export default function HomePage(): ReactNode {
    return <RenderedPage>
        <RenderedLayer>
            <Pulse0></Pulse0>
            <Pulse1></Pulse1>
            <BlurDot0></BlurDot0>
            <BlurDot1></BlurDot1>
        </RenderedLayer>
        <RenderedLayer {...{
            style: {
                justifyContent: "space-between"
            }
        }}>
            <RenderedRow {...{
                style: {
                    width: "100%",
                    height: "auto",
                    gap: "40px",
                    justifyContent: "space-between",
                    padding: "40px"
                },
                mountCooldown: 100
            }}>
                <Navbar>
                    <NavbarItem {...{
                        link: "https://dreamcatcher-1.gitbook.io/dreamcatcher",
                        text0: "01",
                        text1: "Whitepaper"
                    }}>
                    </NavbarItem>
                    <NavbarItem {...{
                        link: "/",
                        text0: "02",
                        text1: "Get Started"
                    }}>
                    </NavbarItem>
                </Navbar>
                <ConnectButton></ConnectButton>
            </RenderedRow>
        </RenderedLayer>
    </RenderedPage>;
}