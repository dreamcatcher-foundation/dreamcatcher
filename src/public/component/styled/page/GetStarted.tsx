import type {ReactNode} from "react";
import {VerticalFlexPage} from "@component/VerticalFlexPage";
import {FlexSlide} from "@component/FlexSlide";
import {FlexSlideLayer} from "@component/FlexSlideLayer";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {Blurdot} from "@component/Blurdot";
import {Nav} from "@component/Nav";
import {Typography} from "@component/Typography";
import {RetroMinimaButton} from "@component/retro-minima/RetroMinimaButton";
import {RetroMinimaInputField} from "@component/retro-minima/RetroMinimaInputField";
import {RetroMinimaCardContainer} from "@component/retro-minima/RetroMinimaCardContainer";
import {useState} from "react";
import {useEffect} from "react";
import {node} from "@component/MockPrototypeVaultNodeInterface";
import {isAddress} from "ethers";
import * as ColorPalette from "@component/ColorPalette";

export type Setter<T> = (item: T) => unknown;

interface Asset {
    toSolStruct(): [string, string, string[], string[], bigint];
    tkn(): string;
    cur(): string;
    tknCurPath(): string[];
    curTknPath(): string[];
    allocation(): bigint;
}

function Asset(_tkn: string, _cur: string, _tknCurPath: string[], _curTknPath: string[], _allocation: number): Asset {
    /***/ {
        _checkAddress(_tkn);
        _checkAddress(_cur);
        for (let i = 0; i < _tknCurPath.length; i++) _checkAddress(_tknCurPath[i]);
        for (let i = 0; i < _curTknPath.length; i++) _checkAddress(_curTknPath[i]);
        if (_allocation > 100) throw Error("allocation-out-of-bounds");
        if (_tknCurPath.length === 0) _tknCurPath = [tkn(), cur()];
        if (_curTknPath.length === 0) _curTknPath = [cur(), tkn()];
        if (tknCurPath()[0] !== tkn()) throw Error("tkn-cur-path-must-start-with-tkn");
        if (curTknPath()[0] !== cur()) throw Error("cur-tkn-path-must-start-with-cur");
        if (tknCurPath()[1] !== cur()) throw Error("tkn-cur-path-must-end-with-cur");
        if (curTknPath()[1] !== tkn()) throw Error("cur-tkn-path-must-end-with-tkn");
        return {toSolStruct, tkn, cur, tknCurPath, curTknPath, allocation};
    }
    function toSolStruct(): [string, string, string[], string[], bigint] {
        return [tkn(), cur(), tknCurPath(), curTknPath(), allocation()];
    }
    function tkn(): string {
        return _tkn;
    }
    function cur(): string {
        return _cur;
    }
    function tknCurPath(): string[] {
        return [... _tknCurPath];
    }
    function curTknPath(): string[] {
        return [... _curTknPath];
    }
    function allocation(): bigint {
        return BigInt(_allocation * 10**18);
    }
    function _checkAddress(string: string): true {
        if (isAddress(string)) return true;
        throw Error("not-address");
    }
}

export function GetStartedPage(): ReactNode {
    let [name, setName] = useState<string>("");
    let [symbol, setSymbol] = useState<string>("");
    let [asset0, setAsset0] = useState<Asset | null>(null);
    let [asset1, setAsset1] = useState<Asset | null>(null);
    let [deploymentArgs, setDeploymentArgs] = useState<[string, string, [[string, string, string[], string[], bigint], [string, string, string[], string[], bigint]]] | null>(null);
    useEffect((): void => {
        try {
            if (!asset0) return;
            if (!asset1) return;
            setDeploymentArgs([name, symbol, [asset0?.toSolStruct(), asset1?.toSolStruct()]])
            return;
        }
        catch (e: unknown) {
            console.error(e);
            return;
        }
    }, [name, symbol, asset0, asset1]);
    async function mint(): Promise<void> {
        if (!deploymentArgs) return;
        await node.mint(deploymentArgs[0], deploymentArgs[1], deploymentArgs[2]);
        return;
    }
    return <>
        <VerticalFlexPage>
            <FlexSlide>
                <GetStartedPageBackgroundLayer/>
                <GetStartedPageContentLayer>
                    <FlexRow style={{gap: "20px"}}>
                        <FlexCol style={{height: "100%", gap: "20px", justifyContent: "start"}}>
                            <MetadataForm setName={setName} setSymbol={setSymbol}/>
                            <FlexRow style={{width: "100%", justifyContent: "space-between"}}>
                                <RetroMinimaButton caption="Confirm" onClick={mint}/>
                                <RetroMinimaButton caption="Help"/>
                            </FlexRow>
                        </FlexCol>
                        <FlexCol style={{gap: "20px"}}>
                            <AssetForm count="01" set={setAsset0}/>
                            <AssetForm count="02" set={setAsset1}/>
                        </FlexCol>
                    </FlexRow>
                </GetStartedPageContentLayer>
            </FlexSlide>
        </VerticalFlexPage>
    </>;
}

export function GetStartedPageBackgroundLayer(): ReactNode {
    return <>
        <FlexSlideLayer style={{background: ColorPalette.OBSIDIAN.toString()}}>
            <FlexRow style={{width: "1024px", height: "100%", position: "relative"}}>
                <Blurdot color0={ColorPalette.DEEP_PURPLE.toString()} color1={ColorPalette.OBSIDIAN.toString()} style={{width: "1000px", aspectRatio: "1/1", position: "absolute", right: "300px", bottom: "20px"}}/>
                <Blurdot color0={ColorPalette.RED.toString()} color1={ColorPalette.OBSIDIAN.toString()} style={{width: "1000px", aspectRatio: "1/1", position: "absolute", left: "300px", top: "20px"}}/>
            </FlexRow>
        </FlexSlideLayer>
    </>;
}

export function GetStartedPageContentLayer({children}: {children?: ReactNode;}): ReactNode {
    return <>
        <FlexSlideLayer>
            <Nav/>
            <FlexCol style={{width: "1024px", height: "100%", gap: "50px"}}>
                {children}
            </FlexCol>
        </FlexSlideLayer>
    </>;
}

export function MetadataForm({setName, setSymbol}: {setName: Setter<string>; setSymbol: Setter<string>}): ReactNode {
    return <>
        <FlexCol style={{justifyContent: "start"}}>
            <RetroMinimaCardContainer>
                <FlexCol style={{gap: "20px"}}>
                    <GetStartedPageMetadataFormHeading/>
                    <GetStartedPageMetadataFormFields setName={setName} setSymbol={setSymbol}/>
                    <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="This will be used to identify your DAO on the blockchain." style={{fontSize: "0.50em"}}/></FlexRow>
                </FlexCol>
            </RetroMinimaCardContainer>
        </FlexCol>
    </>;
}

export function GetStartedPageMetadataFormHeading(): ReactNode {
    return <>
        <FlexCol style={{width: "100%", gap: "5px", alignItems: "start"}}>
            <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="Metadata"/></FlexRow>
            <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="Pick a name and ticker symbol for your DAO." style={{fontSize: "0.5em"}}/></FlexRow>
        </FlexCol>
    </>;
}

export function GetStartedPageMetadataFormFields({setName, setSymbol}: {setName: Setter<string>; setSymbol: Setter<string>}): ReactNode {
    return <>
        <FlexCol style={{width: "100%", gap: "10px", alignItems: "start"}}>
            <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="dao-name" placeholder="ETH WBTC 50 50 Fund" setInput={setName} style={{width: "100%"}}/></FlexRow>
            <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="dao-symbol" placeholder="5050" setInput={setSymbol} style={{width: "100%"}}/></FlexRow>
        </FlexCol>
    </>;
}

export function AssetForm({count, set}: {count: string; set: Setter<Asset>}): ReactNode {
    let [tkn, setTkn] = useState<string>("");
    let [cur, setCur] = useState<string>("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359");
    let [tknCurPath, setTknCurPath] = useState<string[]>([]);
    let [curTknPath, setCurTknPath] = useState<string[]>([]);
    let [allocation, setAllocation] = useState<number>(0);
    useEffect((): void => {
        try {
            set(Asset(tkn, cur, tknCurPath, curTknPath, allocation));
            return;
        }
        catch (e: unknown) {
            console.error(e);
            return;
        }
    }, [tkn, cur, tknCurPath, curTknPath, allocation]);
    return <>
        <FlexCol style={{height: "100%", justifyContent: "start"}}>
            <RetroMinimaCardContainer>
                <FlexCol style={{gap: "20px"}}>
                    <FlexCol style={{width: "100%", gap: "5px", alignItems: "start"}}>
                        <FlexRow style={{width: "100%", gap: "10px", justifyContent: "start"}}>
                            <Typography content={count} style={{color: ColorPalette.DEEP_PURPLE.toString()}}/>
                            <Typography content="Asset"/>
                        </FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="An asset that the DAO will manage." style={{fontSize: "0.5em"}}/></FlexRow>
                    </FlexCol>
                    <FlexCol style={{width: "100%", gap: "10px", alignItems: "start"}}>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="token" placeholder="0x0000000000000000000000000000000000000000" setInput={setTkn} style={{width: "100%"}}/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="token-to-currency-path" placeholder="address,address,address" setInput={e => setTknCurPath(e.split(","))} style={{width: "100%"}}/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="currency-to-token-path" placeholder="address,address,address" setInput={e => setCurTknPath(e.split(","))} style={{width: "100%"}}/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="allocation" placeholder="50" setInput={e => setAllocation(parseFloat(e))} style={{width: "100%"}}/></FlexRow>
                    </FlexCol>
                    <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="When rebalanced the contract will make a swap using the paths provided to bring its total assets into balance. The allocation will determine the amount for each position." style={{fontSize: "0.50em"}}/></FlexRow>
                </FlexCol>
            </RetroMinimaCardContainer>
        </FlexCol>
    </>
}