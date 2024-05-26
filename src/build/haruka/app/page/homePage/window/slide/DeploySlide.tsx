import React, {type ReactNode} from "react";
import Slide from "./Slide.tsx";
import {EventsStream} from "../../../../lib/events-emitter/EventsStream.ts";
import TwoButtonSlot from "./slot/TwoButtonSlot.tsx";
import ButtonHook from "../../../shared/component/input/ButtonHook.tsx";
import MetadataFormSlide from "./MetadataFormSlide.tsx";
import {EthereumVirtualMachine} from "../../../../lib/client-side/EthereumVirtualMachine.tsx";
import {Bytecode} from "../../../../lib/client-side/casing/Bytecode.tsx";
import {AbstractBinaryInterface} from "../../../../lib/client-side/casing/AbstractBinaryInterface.tsx";
import {Url} from "../../../../lib/web/url/Url.ts";

export default function DeploySlide(): ReactNode {
    return (
        <Slide
        nodeKey="deploySlide">
            <TwoButtonSlot
            nodeKey="deploySlide.twoButtonSlot">
                <ButtonHook
                className="swing-in-top-fwd"
                nodeKey="deploySlide.nextButton"
                color="#615FFF"
                text="Deploy"
                onClick={function() {
                    try {
                        EthereumVirtualMachine.deploy(
                            new Bytecode(
                                new Url("/bytecode/client")
                            ),
                            new AbstractBinaryInterface(
                                new Url("/abstractBinaryInterface/client")
                            )
                        )
                    }
                    catch {
                        console.error("Failed");
                    }
                }}/>

                <ButtonHook
                className="swing-in-top-fwd"
                nodeKey="deploySlide.backButton"
                color="#D6D5D4"
                text="Not Ready"
                onClick={() => EventsStream.dispatch("homePage.window", "swap", <MetadataFormSlide/>)}/>
            </TwoButtonSlot>
        </Slide>
    );
}