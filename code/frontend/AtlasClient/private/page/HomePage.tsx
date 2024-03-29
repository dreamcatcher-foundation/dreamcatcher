import {Page} from "../component/Page.tsx";
import {Slide} from "../component/Slide.tsx";
import {Background} from "../component/Background.tsx";
import {RemoteButton} from "../component/RemoteButton.tsx";
import {network} from "../connection/Network.tsx";

export function HomePage() {
    return (
        <Page>
            <Background></Background>
            <Slide zIndex={"2000"}>
                <RemoteButton
                    name={"test"}
                    network={network()}
                    text={"doSomething"}
                    width={"100px"}
                    height={"25px"}/>
            </Slide>
        </Page>
    );
}