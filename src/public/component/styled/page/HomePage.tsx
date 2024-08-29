import type {ReactNode} from "react";
import {VerticalFlexPage} from "@component/VerticalFlexPage";
import {FlexSlide} from "@component/FlexSlide";
import {FlexSlideLayer} from "@component/FlexSlideLayer";
import {FlexRow} from "@component/FlexRow";
import {SimpleGrid} from "@component/SimpleGrid";
import {SimpleGridItem} from "@component/SimpleGridItem";
import {SimpleGridItemCoordinate} from "@component/SimpleGridItemCoordinate";
import {Nav} from "@component/Nav";
import {Typography} from "@component/Typography";
import {Blurdot} from "@component/Blurdot";
import * as ColorPalette from "@component/ColorPalette";

export function HomePage(): ReactNode {
    return <>
        <VerticalFlexPage>
            <FlexSlide>
                <FlexSlideLayer
                style={{
                    background: ColorPalette.OBSIDIAN.toString(),
                    overflowX: "hidden",
                    overflowY: "hidden"
                }}>
                    <FlexRow
                    style={{
                        width: "1024px",
                        height: "100%",
                        position: "relative",
                        overflowX: "visible",
                        overflowY: "visible"
                    }}>
                        <Blurdot
                        color0={ColorPalette.DEEP_PURPLE.toString()}
                        color1={ColorPalette.OBSIDIAN.toString()}
                        style={{
                            width: "800px",
                            aspectRatio: "1/1",
                            position: "absolute",
                            right: "300px",
                            bottom: "20px",
                            zIndex: "1"
                        }}/>

                        <Blurdot
                        color0={ColorPalette.RED.toString()}
                        color1={ColorPalette.OBSIDIAN.toString()}
                        style={{
                            width: "800px",
                            aspectRatio: "1/1",
                            position: "absolute",
                            left: "300px",
                            top: "20px",
                            zIndex: "2"
                        }}/>
                    </FlexRow>
                </FlexSlideLayer>
                <FlexSlideLayer
                style={{
                    justifyContent: "start"
                }}>
                    <Nav/>

                    <SimpleGrid
                    rowCount={10n}
                    colCount={10n}
                    style={{
                        width: "1024px",
                        height: "500px"
                    }}>
                        <SimpleGridItem
                        start={SimpleGridItemCoordinate({x: 2n, y: 2n})}
                        end={SimpleGridItemCoordinate({x: 6n, y: 6n})}>

                        </SimpleGridItem>
                    </SimpleGrid>
                </FlexSlideLayer>
            </FlexSlide>

            <FlexSlide>
                <FlexSlideLayer
                style={{
                    background: ColorPalette.OBSIDIAN.toString()
                }}>

                </FlexSlideLayer>
            </FlexSlide>
        </VerticalFlexPage>
    </>;
}