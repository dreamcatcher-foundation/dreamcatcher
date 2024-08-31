import type {ReactNode} from "react";
import {MockPrototypeVaultInterface} from "@component/MockPrototypeVaultInterface";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {Nav} from "@component/Nav";
import {Blurdot} from "@component/Blurdot";
import {Sprite} from "@component/Sprite";
import {Typography} from "@component/Typography";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMachine} from "@xstate/react";
import {useMemo} from "react";
import {useState} from "react";
import * as ColorPalette from "@component/ColorPalette";

export function ExplorePage() {
    let [pageBackgroundColor, setPageBackgroundColor] = useState<string>(ColorPalette.OBSIDIAN.toString());
    let [address0, setAddress0] = useState<string>("");
    let [address1, setAddress1] = useState<string>("");
    let [address2, setAddress2] = useState<string>("");
    return <>
        <FlexCol
        style={{
            width: "100vw",
            height: "100vh",
            overflowX: "hidden",
            overflowY: "hidden",
            pointerEvents: "none",
            background: pageBackgroundColor,
            justifyItems: "space-between"
        }}>
            <FlexCol
            style={{
                width: "100%",
                height: "100%",
                position: "absolute"
            }}>
                <Blurdot
                color0={ColorPalette.PINK.toString()}
                color1={pageBackgroundColor}
                style={{
                    width: "500px",
                    aspectRatio: "1/1",
                    position: "absolute",
                    right: "200px",
                    bottom: "100px"
                }}/>
            </FlexCol>

            <FlexCol
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "space-between",
                position: "absolute"
            }}>
                <Nav/>

                <FlexCol
                style={{
                    width: "1024px",
                    height: "100%",
                    gap: "5%"
                }}>
                    <Typography
                    content="<"
                    style={{
                        fontSize: "2em"
                    }}/>

                    <Typography
                    content=">"
                    style={{
                        fontSize: "2em"
                    }}/>

                    <FlexRow
                    style={{
                        width: "100%",
                        height: "auto",
                        gap: "5%"
                    }}>
                        <ExplorePageCard
                        address={address0}/>

                        <ExplorePageCard
                        address={address1}/>

                        <ExplorePageCard
                        address={address2}/>
                    </FlexRow>

                    <FlexRow
                    style={{
                        width: "100%",
                        height: "auto",
                        gap: "5%"
                    }}>
                        <ExplorePageCard
                        address={address0}/>

                        <ExplorePageCard
                        address={address1}/>

                        <ExplorePageCard
                        address={address2}/>
                    </FlexRow>

                    <FlexRow
                    style={{
                        width: "100%",
                        height: "auto",
                        gap: "5%"
                    }}>
                        <ExplorePageCard
                        address={address0}/>

                        <ExplorePageCard
                        address={address1}/>

                        <ExplorePageCard
                        address={address2}/>
                    </FlexRow>
                </FlexCol>
            </FlexCol>
        </FlexCol>
    </>;
}

export function ExplorePageNav() {
    
}

export function ExplorePageCard({address}: {address: string;}) {
    let [name, setName] = useState<string>("****");
    let [symbol, setSymbol] = useState<string>("****");
    let [totalAssets, setTotalAssets] = useState<number>(0);
    let [totalSupply, setTotalSupply] = useState<number>(0);
    let [quote, setQuote] = useState<number>(0);
    let [mounted, setMounted] = useState<ReactNode>(<></>);
    let [_, setExplorePageCard] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBsB7dCAqAYlgFdNM5YBtABgF1FQAHCrFwAXXBXx8QAD0QAmTgFYSATjkAOAIwb1KxQGZtANjkAaEAE9EmzgBYSnFUfVHFR7QHZNbjwF9f5mhYeISklNS0dABm6LhkjABOYFy8SCCCwmISUrIICspqWjp6hnIm5lZ5cnIkBtUetuqKcvq2ih7q-oEYOATE5FQ0+FAAYrFkkHQQEsk8Uhmi4pJpudUqJPpucoqaKioeSvoeRhXWHjVtNtW2Suoepf4BIPgUEHBSQb2h80KL2SuIAC0J0sQKMDk4kKh0MhmlsXRAnxC-XCQygP0ySxyiFsZlBCDh61stg8Kk47i8HlJnD8TyRfTCg1oYzikAxf2WoFy+g0tRuRn0nH0ejcmhBlU0LhIku0rTkKh56jk8LpPWRpFwEAm7KynJkiEVfPJguFilF4sQWgcCoaNpccjFmkeviAA */
        initial: "loading",
        states: {
            loading: {
                entry: () => {
                    (async () => {
                        setMounted(<ExplorePageCardLoadingSlide/>);
                        try {
                            let contract: MockPrototypeVaultInterface = MockPrototypeVaultInterface(address);
                            setName(await contract.name());
                            setSymbol(await contract.symbol());
                            setTotalAssets(await contract.totalAssets()[1]);
                            setTotalSupply(await contract.totalSupply());
                            setQuote(await contract.quote()[1]);
                            setExplorePageCard({type: "success"});
                            return;
                        }
                        catch (e: unknown) {

                        }
                    })();
                },
                on: {
                    success: "idle",
                    failure: "loadingFailed"
                }
            },
            loadingFailed: {
                entry: () => setTimeout(() => setExplorePageCard({type: "done"}), 3000),
                on: {
                    done: "loading"
                }
            },
            idle: {
                entry: () => {
                    
                    
                }
            }
        }
    }), [address, setName, setSymbol, setTotalAssets, setTotalSupply, setQuote, setMounted]));
    return <>
        <FlexCol
        style={{
            width: "300px",
            aspectRatio: "2/1",
            background: ColorPalette.SOFT_OBSIDIAN.toString(),
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: ColorPalette.GHOST_IRON.toString()
        }}>
            {mounted}
        </FlexCol>
    </>;
}

export function ExplorePageCardLoadingSlide(): ReactNode {
    return <>
        <FlexRow
        style={{
            width: "100%",
            height: "100%"
        }}>
            <Sprite
            src="../../../img/animation/loader/Infinity.svg"
            style={{
                width: "50%",
                aspectRatio: "1/1"
            }}/>
        </FlexRow>
    </>;
}