import type {ReactNode} from "react";
import {MockPrototypeVaultInterface} from "@component/MockPrototypeVaultInterface";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {Nav} from "@component/Nav";
import {Sprite} from "@component/Sprite";
import {Typography} from "@component/Typography";
import {DualLabelButton} from "@component/DualLabelButton";
import {VerticalFlexPage} from "@component/VerticalFlexPage";
import {FlexSlide} from "@component/FlexSlide";
import {FlexSlideLayer} from "@component/FlexSlideLayer";
import {useEffect, useRef} from "react";
import {useState} from "react";
import {node} from "@component/MockPrototypeVaultNodeInterface";
import * as ColorPalette from "@component/ColorPalette";

export function ExplorePage(): ReactNode {
    let [address, setAddress] = useState<string>("");

    useEffect((): void => {
        (async (): Promise<void> => {
            setAddress((await node.child(0n))[1]);
        })();
        return;
    }, []);

    return <>
        <VerticalFlexPage>
            <FlexSlide>
                <FlexSlideLayer style={{background: ColorPalette.OBSIDIAN.toString()}}/>
                <ExplorePageContentLayer>
                    <ExplorePageCard address={address}/>
                </ExplorePageContentLayer>
            </FlexSlide>
        </VerticalFlexPage>
    </>;
}

export function ExplorePageContentLayer({children}: {children?: ReactNode;}): ReactNode {
    return <>
        <FlexSlideLayer>
            <Nav/>
            <FlexCol style={{width: "1024px", height: "100%", gap: "50px"}}>
                {children}
            </FlexCol>
        </FlexSlideLayer>
    </>;
}

export function ExplorePageCard({address}: {address?: string;}): ReactNode {
    let [name, setName] = useState<string>("****");
    let [symbol, setSymbol] = useState<string>("****");
    let [totalAssets, setTotalAssets] = useState<number>(0);
    let [totalSupply, setTotalSupply] = useState<number>(0);
    let [quote, setQuote] = useState<number>(0);
    let [mounted, setMounted] = useState<ReactNode>(<></>);
    useEffect((): void => {
        setMounted(<ExplorePageCardLoaderSlide/>);
        (async (): Promise<void> => {
            if (!address) return;
            try {
                let contract: MockPrototypeVaultInterface = MockPrototypeVaultInterface(address);
                let name: string = await contract.name();
                let symbol: string = await contract.symbol();
                let totalAssets: number = (await contract.totalAssets())[1];
                let totalSupply: number = (await contract.totalSupply());
                let quote: number = (await contract.quote())[1];
                setName(name);
                setSymbol(symbol);
                setTotalAssets(totalAssets);
                setTotalSupply(totalSupply);
                setQuote(quote);
                setMounted(<ExplorePageCardLoadedSlide address={address} name={name} symbol={symbol} totalAssets={totalAssets} totalSupply={totalSupply} quote={quote}/>);
                return;
            }
            catch (e: unknown) {
                setName("****");
                setSymbol("****");
                setTotalAssets(0);
                setTotalSupply(0);
                setQuote(0);
                return;
            }
        })();
        return;
    }, [address]);
    return <>
        <FlexCol style={{padding: "10px", borderRadius: "10px", background: ColorPalette.SOFT_OBSIDIAN.toString()}}>
            {mounted}
        </FlexCol>
    </>;
}

export function ExplorePageCardLoaderSlide(): ReactNode {
    return <>
        <FlexCol style={{width: "100%", height: "100%"}}>
            <Sprite src="../../../img/animation/loader/Infinity.svg" style={{width: "50px", aspectRatio: "1/1"}}/>
        </FlexCol>
    </>;
}

export function ExplorePageCardLoadedSlide({address, name, symbol, totalAssets, totalSupply, quote}: {address: string; name: string; symbol: string; totalAssets: number; totalSupply: number; quote: number;}): ReactNode {
    let amount = useRef<string>("0");
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
                <Button label0="Mint" label1="⟡" onClick={() => MockPrototypeVaultInterface(address).mint(parseFloat(amount.current))}/>
                <Button label0="Burn" label1="☀︎" onClick={() => MockPrototypeVaultInterface(address).burn(parseFloat(amount.current))}/>
            </FlexRow>
            <FlexRow>
                <input onChange={e => amount.current = e.target.value} type="number" placeholder={`USDC (Buy) or ${symbol} (Sell)`} style={{width: "100%", all: "unset", pointerEvents: "auto", cursor: "text", color: ColorPalette.TITANIUM.toString(), fontFamily: "satoshiRegular"}}/>
            </FlexRow>
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