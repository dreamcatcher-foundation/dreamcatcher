import type {ReactNode} from "react";
import {VerticalFlexPage} from "@component/VerticalFlexPage";
import {FlexSlide} from "@component/FlexSlide";
import {FlexSlideLayer} from "@component/FlexSlideLayer";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {FlexItem} from "@component/FlexItem";
import {SimpleGrid} from "@component/SimpleGrid";
import {SimpleGridItem} from "@component/SimpleGridItem";
import {SimpleGridItemCoordinate} from "@component/SimpleGridItemCoordinate";
import {Nav} from "@component/Nav";
import {Typography} from "@component/Typography";
import {Blurdot} from "@component/Blurdot";
import {Sprite} from "@component/Sprite";
import {DualLabelLink} from "@component/DualLabelLink";
import * as ColorPalette from "@component/ColorPalette";

export function HomePage(): ReactNode {
    return <>
        <VerticalFlexPage>
            <FlexSlide>
                <FlexSlideLayer style={{background: ColorPalette.OBSIDIAN.toString(), overflow: "hidden"}}>
                    <FlexRow style={{width: "1024px", height: "100%", position: "relative"}}>
                        <Blurdot color0={ColorPalette.DEEP_PURPLE.toString()} color1={ColorPalette.OBSIDIAN.toString()} style={{width: "800px", aspectRatio: "1/1", position: "absolute", right: "300px", bottom: "20px"}}/>
                        <Blurdot color0={ColorPalette.RED.toString()} color1={ColorPalette.OBSIDIAN.toString()} style={{width: "800px", aspectRatio: "1/1", position: "absolute", left: "300px", top: "20px"}}/>
                    </FlexRow>
                </FlexSlideLayer>
                <FlexSlideLayer style={{justifyContent: "space-between", paddingBottom: "10px"}}>
                    <Nav/>
                    <FlexRow style={{width: "1024px", height: "100%"}}>
                        <FlexCol style={{width: "100%", height: "100%", gap: "36px"}}>
                            <FlexCol style={{width: "100%"}}>
                                <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="Shape the Decentralized Enterprise." style={{fontSize: "3em"}}/></FlexRow>
                                <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="Deploy and Manage Trusless Systems." style={{fontSize: "1.5em"}}/></FlexRow>
                            </FlexCol>
                            <FlexRow style={{width: "100%", justifyContent: "start", gap: "20px"}}>
                                <DualLabelLink to="/get-started" label0="Get Started" label1="✦" size={200} color={ColorPalette.TITANIUM.toString()} onClick={() => {}}/>
                                <DualLabelLink to="https://dreamcatcher-1.gitbook.io/dreamcatcher" label0="Learn More" label1="✦" size={200} color={ColorPalette.TITANIUM.toString()} onClick={() => {}}/>
                            </FlexRow>
                        </FlexCol>
                        <FlexCol style={{width: "100%", height: "100%"}}><Sprite src="../../../img/whale.svg" style={{width: "100%", aspectRatio: "1/1", objectFit: "contain"}}/></FlexCol>
                    </FlexRow>
                </FlexSlideLayer>
            </FlexSlide>

            <_Slide caption0="01" caption1="About Us">
                <FlexRow style={{width: "1024px", height: "100%"}}>
                    <FlexCol style={{width: "100%", height: "100%"}}><Sprite src="../../../img/woman.svg" style={{width: "75%", aspectRatio: "1/1", objectFit: "contain"}}/></FlexCol>
                    <FlexCol style={{width: "100%", height: "100%", gap: "20px"}}>
                        <TearDropBulletPoint caption="Storytelling" content="We are a community of storytellers who unite through technology, code, and art."/>
                        <TearDropBulletPoint caption="Exploration" content="We are a community of explorers who embrace research and adventure, dedicated to discovering new realms and pushing boundaries."/>
                        <TearDropBulletPoint caption="Passion" content="We are passionate about our work, advocating for the right incentives and valuing a genuine love for what we do above all else."/>
                    </FlexCol>
                </FlexRow>
            </_Slide>

            <_Slide caption0="" caption1="">
                <FlexRow style={{width: "1024px", height: "100%"}}>
                    <FlexCol style={{width: "100%", height: "100%", gap: "20px"}}>
                        <TearDropBulletPoint caption="Entrepreneurship" content="We champion entrepreneurship as pioneers, paving the way for others, even when not directly benefiting."/>
                        <TearDropBulletPoint caption="Automation" content="We advocate for technology as a force for good, enabling increased productivity and benefit for all."/>
                        <TearDropBulletPoint caption="Imagination" content="We champion imagination, valuing dreams and recognizing potential where others may not. Our core belief is that anything is achievable."/>
                    </FlexCol>
                    <FlexCol style={{width: "100%", height: "100%"}}><Sprite src="../../../img/hodl.svg" style={{width: "75%", aspectRatio: "1/1", objectFit: "contain"}}/></FlexCol>
                </FlexRow>
            </_Slide>
        </VerticalFlexPage>
    </>

    function _Slide({caption0, caption1, children}: {caption0: string; caption1: string; children?: ReactNode;}): ReactNode {
        return <>
            <FlexSlide>
                <FlexSlideLayer
                style={{
                    background: ColorPalette.OBSIDIAN.toString()
                }}/>
                <FlexSlideLayer
                style={{
                    justifyContent: "space-between"
                }}>
                    <FlexRow
                    style={{
                        width: "1024px",
                        height: "auto"
                    }}>
                        <FlexRow
                        style={{
                            width: "100%",
                            height: "100%",
                            justifyContent: "start",
                            gap: "2.5%"
                        }}>
                            <Typography
                            content={caption0}
                            style={{
                                fontSize: "4em",
                                color: ColorPalette.DEEP_PURPLE.toString()
                            }}/>  

                            <Typography
                            content={caption1}
                            style={{
                                fontSize: "4em"
                            }}/>
                        </FlexRow>
                    </FlexRow>
                    {children}
                </FlexSlideLayer>
            </FlexSlide>
        </>;
    }
}



export function HomePageMainSlide(): ReactNode {
    return <>
        <FlexSlide>
            <HomePageMainSlideBackgroundLayer/>
            <HomePageMainSlideContentLayer/>
        </FlexSlide>
    </>;
}

export function HomePageMainSlideContentLayer(): ReactNode {
    return <>
        <FlexSlideLayer
        style={{
            justifyContent: "space-between",
            paddingBottom: "1%"
        }}>
            <Nav/>

            <HomePageMainSlideContentLayerHeroSection/>



            <FlexRow>
                <Typography
                content={"Dreamcatcher 2024"}
                style={{
                    fontSize: "0.75em"
                }}/>
            </FlexRow>
        </FlexSlideLayer>
    </>;
}



export function HomePageMainSlideContentLayerHeroSection(): ReactNode {
    return <>
        <FlexRow
        style={{
            width: "1024px",
            height: "auto"
        }}>
            <FlexCol
            style={{
                width: "100%",
                height: "100%",
                gap: "10%"
            }}>
                <FlexCol
                style={{
                    width: "100%"
                }}>
                    <FlexRow
                    style={{
                        width: "100%",
                        justifyContent: "start"
                    }}>
                        <Typography
                        content={"Shape the Decentralized Enterprise."}
                        style={{
                            fontSize: "3em"
                        }}/>
                    </FlexRow>

                    <FlexRow
                    style={{
                        width: "100%",
                        justifyContent: "start"
                    }}>
                        <Typography
                        content={"We think money should be global."}
                        style={{
                            fontSize: "2em"
                        }}/>
                    </FlexRow>
                </FlexCol>

                <FlexRow
                style={{
                    width: "100%",
                    justifyContent: "start",
                    gap: "5%"
                }}>
                    <DualLabelLink
                    to=""
                    label0="Get Started"
                    label1="▸"
                    size={200}
                    color={ColorPalette.TITANIUM.toString()}
                    onClick={() => {}}/>

                    <DualLabelLink
                    to=""
                    label0="Learn More"
                    label1="▸"
                    size={200}
                    color={ColorPalette.TITANIUM.toString()}
                    onClick={() => {}}/>   
                </FlexRow>
            </FlexCol>

            <FlexCol
            style={{
                width: "100%",
                height: "100%"
            }}>
                <Sprite
                src="../../../img/whale.svg"
                style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "contain"
                }}/>
            </FlexCol>
        </FlexRow>
    </>;
}

export function HomePageMainSlideBackgroundLayer(): ReactNode {
    return <>
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
    </>;
}

export function HomePageSlide({ caption0, caption1, children }: { caption0: string; caption1: string; children?: ReactNode; }) {
    return <>
        <FlexSlide>
            <FlexSlideLayer
            style={{
                background: ColorPalette.OBSIDIAN.toString()
            }}/>
            <FlexSlideLayer
            style={{
                justifyContent: "space-between"
            }}>
                <FlexRow
                style={{
                    width: "1024px",
                    height: "auto"
                }}>
                    <FlexRow
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "start",
                        gap: "2.5%"
                    }}>
                        <Typography
                        content={caption0}
                        style={{
                            fontSize: "4em",
                            color: ColorPalette.DEEP_PURPLE.toString()
                        }}/>  

                        <Typography
                        content={caption1}
                        style={{
                            fontSize: "4em"
                        }}/>
                    </FlexRow>
                </FlexRow>
                {children}
            </FlexSlideLayer>
        </FlexSlide>
    </>;
}

export function HomePageCard({ src, caption, description }: { src: string; caption: string; description: string; }): ReactNode {
    return <>
        <FlexRow
        style={{
            width: "100%",
            height: "100%",
            paddingTop: "1%",
            paddingBottom: "1%",
            paddingLeft: "1%",
            paddingRight: "1%",
            overflowX: "hidden",
            overflowY: "hidden",
            gap: "5%"
        }}>
            <FlexCol
            style={{
                width: "50%",
                height: "100%",
                justifyContent: "start"
            }}>
                <Sprite
                src={src}
                style={{
                    width: "50%",
                    aspectRatio: "1/1",
                    objectFit: "contain"
                }}/>
            </FlexCol>

            <FlexCol
            style={{
                width: "100%",
                height: "100%",
                gap: "5%",
                justifyContent: "start"
            }}>
                <FlexRow
                style={{
                    width: "100%",
                    height: "auto",
                    justifyContent: "start"
                }}>
                    <Typography
                    content={caption}
                    style={{
                        fontSize: "1.25em"
                        
                    }}/>
                </FlexRow>

                <FlexRow
                style={{
                    width: "100%",
                    height: "auto",
                    justifyContent: "start"
                }}>
                    <Typography
                    content={description}
                    style={{
                        fontSize: "0.75em"
                    
                    }}/>
                </FlexRow>
            </FlexCol>
        </FlexRow>
    </>;
}


export function TearDropBulletPoint({caption, content}: {caption: string; content: string;}): ReactNode {
    return <>
        <FlexCol style={{width: "100%", alignItems: "start", gap: "10px"}}>
            <FlexRow style={{gap: "10px"}}>
                <Sprite src="../../../img/shape/Tear.svg" style={{width: "25px", aspectRatio: "1/1", objectFit: "contain"}}/>
                <Typography content={caption} style={{fontSize: "2em"}}/>
            </FlexRow>
            <FlexRow><Typography content={content} style={{fontSize: "1em"}}/></FlexRow>
        </FlexCol>
    </>;
}