import type {ReactNode} from "react";
import {MockPrototypeVaultInterface} from "@component/MockPrototypeVaultInterface";
import {MockPrototypeVaultNodeInterface} from "@component/MockPrototypeVaultNodeInterface";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {Nav} from "@component/Nav";
import {Blurdot} from "@component/Blurdot";
import {Sprite} from "@component/Sprite";
import {Typography} from "@component/Typography";
import {DualLabelButton} from "@component/DualLabelButton";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMachine} from "@xstate/react";
import {useEffect, useMemo} from "react";
import {useState} from "react";
import * as ColorPalette from "@component/ColorPalette";

export function ExplorePage(): ReactNode {
    let [batch, setBatch] = useState<(string[])[]>([]);
    let [batchCursor, setBatchCursor] = useState<number>(0);
    useEffect(() => {
        (async () => {
            let stored: string[];
            try {
                console.log("fetching");
                stored = await MockPrototypeVaultNodeInterface("0xa3d19477B551C8d0f4AD8A5eE0080ED5Ad094dC5").deployed();
            }
            catch (e: unknown) {
                console.error(e);
                stored = [];
            }
            console.log(stored);
            if (stored.length === 0) {
                return;
            }
            let batchSize: number = 6;
            let batch: string[][] = [];
            let chunk: string[] = [];
            let cursor: number = 0;
            while (stored.length > 0) {
                let item: string = stored[cursor];
                chunk.push(item);
                if (chunk.length === batchSize) {
                    batch.push(chunk);
                    chunk = [];
                }
                cursor += 1;
            }
            setBatch(batch);
            return;
        })();
        return;
    }, []);
    return <>
        <FlexCol style={{width: "100vw", height: "100vh", overflow: "hidden", pointerEvents: "none", background: ColorPalette.OBSIDIAN.toString()}}>
            <FlexCol style={{width: "1024px", height: "100%", justifyContent: "start"}}>
                <Nav/>
                <FlexRow>
                    
                </FlexRow>
            </FlexCol>
        </FlexCol>
    </>;
}

export function Card({address}: {address: string;}): ReactNode {
    let [name, setName] = useState<string>("****");
    let [symbol, setSymbol] = useState<string>("****");
    let [totalAssets, setTotalAssets] = useState<number>(0);
    let [totalSupply, setTotalSupply] = useState<number>(0);
    let [quote, setQuote] = useState<number>(0);
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
                setMounted(<CardLoadedSlide address={address} name={name} symbol={symbol} totalAssets={totalAssets} totalSupply={totalSupply} quote={quote}/>);
                return;
            }
        })();
        return;
    }, [address]);
    return <><FlexCol style={{padding: "10px", borderRadius: "10px", background: ColorPalette.SOFT_OBSIDIAN.toString()}}>{mounted}</FlexCol></>;
}

export function CardLoadedSlide({address, name, symbol, totalAssets, totalSupply, quote}: {address: string; name: string; symbol: string; totalAssets: number; totalSupply: number; quote: number;}): ReactNode {
    let [amount, setAmount] = useState<number>(0);
    return <>
        <FlexCol style={{width: "100%", height: "100%", gap: "10px", overflow: "hidden"}}>
            <FlexRow style={{width: "100%", gap: "10px", justifyContent: "start"}}>
                <Typography content={name}/>
                <Typography content={symbol}/>
            </FlexRow>
            <FlexRow><Typography content={address} style={{fontSize: "0.5em"}}/></FlexRow>
            <CardData tag="total-assets" content={totalAssets.toFixed(2)}/>
            <CardData tag="total-supply" content={totalSupply.toFixed(2)}/>
            <CardData tag="quote" content={quote.toFixed(2)}/>
            <FlexRow style={{width: "100%", gap: "10px"}}>
                <Button label0="Mint" label1="⟡" onClick={() => MockPrototypeVaultInterface(address).mint(amount)}/>
                <Button label0="Burn" label1="☀︎" onClick={() => MockPrototypeVaultInterface(address).burn(amount)}/>
            </FlexRow>
            <FlexRow><input type="number" placeholder={`USDC (Buy) or ${symbol} (Sell)`} onChange={e => setAmount(Number(e.target.value))} style={{width: "100%", all: "unset", pointerEvents: "auto", cursor: "text", color: ColorPalette.TITANIUM.toString(), fontFamily: "satoshiRegular"}}/></FlexRow>
        </FlexCol>
    </>;
}

export function CardData({tag, content}: {tag: string; content: string}): ReactNode {
    return <>
        <GhostIronBorder width="100%">
            <FlexRow style={{width: "100%"}}>
                <FlexRow style={{width: "100%"}}><FlexRow style={{width: "100%", padding: "10%", justifyContent: "start"}}><Typography content={tag}/></FlexRow></FlexRow>
                <FlexRow style={{width: "100%"}}><FlexRow style={{width: "100%", padding: "10%", justifyContent: "start"}}><Typography content={content}/></FlexRow></FlexRow>
            </FlexRow>
        </GhostIronBorder>
    </>;
}

export function CardLoaderSlide(): ReactNode {
    return <><FlexCol style={{width: "100%", height: "100%"}}><Sprite src="../../../img/animation/loader/Infinity.svg" style={{width: "50px", aspectRatio: "1/1"}}/></FlexCol></>;
}

export function Button({label0, label1, onClick}: {label0: string; label1: string; onClick: Function;}): ReactNode {
    return <><DualLabelButton label0={label0} label1={label1} size={100} color={ColorPalette.GHOST_IRON.toString()} onClick={onClick}/></>;
}

export function GhostIronBorder({width, height, children}: {width?: string; height?: string; children?: ReactNode;}): ReactNode {
    return <><FlexCol style={{width, height, borderColor: ColorPalette.GHOST_IRON.toString(), borderWidth: "1px", borderStyle: "solid"}}>{children}</FlexCol></>;
}

export function SoftObsidianContainer({width, height, children}:{width?: string; height?: string; children?: ReactNode;}): ReactNode {
    return <><FlexCol style={{width, height, background: ColorPalette.SOFT_OBSIDIAN.toString()}}>{children}</FlexCol></>;
}