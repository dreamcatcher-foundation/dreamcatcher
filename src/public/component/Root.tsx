import type { ReactNode } from "react";
import type { AnyEventObject } from "xstate";
import { Page } from "@component/Page";
import { Layer } from "@component/Layer";
import { Nav } from "@component/Nav";
import { Col } from "@component/Col";
import { Ref } from "@lib/Ref";
import { MainSlide } from "@component/slide/MainSlide";
import { useMachine } from "@xstate/react";
import { useEffect, useMemo } from "react";
import { createMachine as Machine } from "xstate";
import { useState } from "react";
import * as ColorPalette from "@component/ColorPalette";

export const setRootRef: Ref<((e: AnyEventObject) => void) | undefined> = Ref(undefined);

export function Root(): ReactNode {
    const [slide, setSlide] = useState<ReactNode>();
    const [_, setRoot] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgwIGIoB7AF2oFEAPABwBtqAnMAbQAYAuolAtqsXLVzV8wkE0QAmPgFYSATgUAOAIxbNa5QGZdANgUAaEAE9E24yW0B2ZXz7bNCl2oAsCkwF9-SzQsPEJSMFYObio6agBZdAJ+ISQQUXFJaVl5BAVPBz41Q003bRNjEssbBB0SIsNHb2LHTTNyhUCgkHxqCDhZEJwCYlkMiSkZNNyAWhNqxDnA4Ixh8LIkqZExCezpxF8FhA0SQwVDNUdtbxLlZRNHQ2WQIbDiEkj2LjAxnaytuSIQz3BytOzeIwXXR8bxHHwkDwXEymEx8Qx8TTeLr+IA */
        initial: "main",
        states: {
            main: {
                entry: () => {
                    setSlide(<MainSlide/>);
                    return;
                },
                on: {
                    gotoExplore: "explore"
                }
            },
            explore: {
                entry: () => {
                    setSlide(<div
                    style={{
                        fontSize: "10em",
                        color: "#FFFFFF"
                    }}>

                            jJJJJJ
                    </div>)
                },
                on: {
                    gotoMain: "main"
                }
            }
        }
    }), [setSlide]));
    useEffect(() => setRootRef.set(setRoot), [setSlide]);
    return <>
        <Page
        hlen={ 1n }
        vlen={ 1n }>
            <Layer
            style={{
                background: "#171717"
            }}/>
            <Layer>
                <Nav/>
                <Col
                style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    { slide }
                </Col>
            </Layer>
        </Page>
    </>;
}