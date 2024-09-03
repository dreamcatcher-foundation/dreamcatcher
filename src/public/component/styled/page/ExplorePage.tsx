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
import {useEffect, useMemo} from "react";
import {useState} from "react";
import * as ColorPalette from "@component/ColorPalette";

export function ExplorePage(): ReactNode {
    return <>
        <FlexCol style={{width: "100vw", height: "100vh", overflow: "hidden", pointerEvents: "none", background: ColorPalette.OBSIDIAN.toString()}}>
            <FlexCol style={{width: "1024px", height: "100%", justifyContent: "start"}}>
                <Nav/>
                <FlexRow style={{width: "100%", justifyContent: "start", gap: "20px"}}>
                    <FlexCol style={{height: "100%", justifyContent: "start"}}><SearchBar/></FlexCol>
                    <FlexCol style={{height: "100%", justifyContent: "start"}}>
                        <FlexCol style={{width: "500px", height: "auto", background: ColorPalette.SOFT_OBSIDIAN.toString(), borderWidth: "1px", borderStyle: "solid", borderColor: ColorPalette.GHOST_IRON.toString()}}>
                            <Typography content="Blue Palm Capital" style={{fontSize: "2em"}}/>
                            <Typography content="BPC" style={{fontSize: "1em"}}/>
                        </FlexCol>
                    </FlexCol>
                </FlexRow>

                <Card address={"0x0000000000000000000000000000000000000000"}/>
                <Card address={"0x0000000000000000000000000000000000000000"}/>
            </FlexCol>
        </FlexCol>
    </>;
}


export function SearchBar(): ReactNode {
    return <>
        <FlexCol style={{width: "500px", height: "auto", gap: "10px"}}>
            <FlexRow style={{width: "100%", height: "100%", background: ColorPalette.DARK_OBSIDIAN.toString(), padding: "10px", gap: "10px", borderWidth: "1px", borderStyle: "solid", borderColor: ColorPalette.GHOST_IRON.toString()}}>
                <input type="text" placeholder="0x0000000000000000000000000000000000000000" style={{width: "100%", height: "100%", color: ColorPalette.TITANIUM.toString(), background: "transparent", pointerEvents: "auto", cursor: "text", borderWidth: "0px", borderColor: "transparent", fontSize: "1em", fontWeight: "bold", fontFamily: "satoshiRegular", outline: "none"}}/>
            </FlexRow>
            <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="Lookup any address." style={{fontSize: "0.5em"}}/></FlexRow>
        </FlexCol>
    </>;
}


export function Card({address}: {address: string;}): ReactNode {
    let [name, setName] = useState<string>("BIG CAPITAL");
    let [symbol, setSymbol] = useState<string>("BC");
    let [totalAssets, setTotalAssets] = useState<number>(2056);
    let [totalSupply, setTotalSupply] = useState<number>(2034283);
    let [quote, setQuote] = useState<number>(7.293);
    let [mounted, setMounted] = useState<ReactNode>(<></>);
    useEffect(function() {
        (async function() {
            setMounted(<CardLoaderSlide/>);
            try {
                let contract: MockPrototypeVaultInterface = MockPrototypeVaultInterface(address);
                setName(await contract.name());
                setSymbol(await contract.symbol());
                setTotalAssets(await contract.totalAssets()[1]);
                setTotalSupply(await contract.totalSupply());
                setQuote(await contract.quote()[1]);
            }
            catch (e: unknown) {
                setName("****");
                setSymbol("****");
                setTotalAssets(0);
                setTotalSupply(0);
                setQuote(0);
            }
            finally {
                return setMounted(<CardIdleSlide address={address} name={name} symbol={symbol} totalAssets={totalAssets} totalSupply={totalSupply} quote={quote}/>);
            }
        })();
    }, [address]);
    return <>
        <FlexCol style={{width: "300px", height: "auto", padding: "10px"}}>
            {mounted}
        </FlexCol>
    </>;
}

export function CardIdleSlide({address, name, symbol, totalAssets, totalSupply, quote}: {address: string; name: string; symbol: string; totalAssets: number; totalSupply: number; quote: number;}): ReactNode {
    return <>
        <FlexCol style={{width: "100%", height: "100%", gap: "10px"}}>
            <FlexRow style={{width: "100%", gap: "10px", justifyContent: "start"}}>
                <Typography content={name}/>
                <Typography content={symbol} style={{fontSize: "0.75em"}}/>
            </FlexRow>
            <FlexRow style={{width: "100%", justifyContent: "start"}}>
                <Tag src="../../../img/shape/Composition.svg" content={`$${totalAssets.toLocaleString()}`}/>
                <Tag src="../../../img/shape/TwoSquares.svg" content={`${totalSupply.toLocaleString()} shares`}/>
            </FlexRow>
        </FlexCol>
    </>;
}

export function CardLoaderSlide(): ReactNode {
    return <>
        <FlexCol style={{width: "100%", height: "100%"}}>
            <Sprite src="../../../img/animation/loader/Infinity.svg" style={{width: "50px", aspectRatio: "1/1"}}/>
        </FlexCol>
    </>;
}

export function SoftObsidianContainer({width, height, children}: {width: string; height: string; children?: ReactNode}): ReactNode {
    return <>
        <FlexRow style={{width, height, background: ColorPalette.SOFT_OBSIDIAN.toString(), gap: "5px", padding: "10px", borderColor: ColorPalette.GHOST_IRON.toString(), borderWidth: "1px", borderStyle: "solid", borderRadius: "10px"}}>
            {children}
        </FlexRow>
    </>;
}

export function Tag({src, content}: {src: string; content: string;}): ReactNode {
    return <>
        <FlexRow style={{padding: "10px", gap: "5px"}}>
            <Sprite src={src} style={{width: "10px", aspectRatio: "1/1"}}/>
            <Typography content={content} style={{fontSize: "0.75em"}}/>
        </FlexRow>
    </>;
}

export function Button(): ReactNode {
    return <>
        
    </>;
}