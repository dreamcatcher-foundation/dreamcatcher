import type {ReactNode} from "react";
import {VerticalFlexPage} from "@component/VerticalFlexPage";
import {FlexSlide} from "@component/FlexSlide";
import {FlexSlideLayer} from "@component/FlexSlideLayer";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {Blurdot} from "@component/Blurdot";
import {Nav} from "@component/Nav";
import {Typography} from "@component/Typography";
import {Sprite} from "@component/Sprite";
import {RetroMinimaButton} from "@component/retro-minima/RetroMinimaButton";
import {RetroMinimaInputField} from "@component/retro-minima/RetroMinimaInputField";
import {RetroMinimaCardContainer} from "@component/retro-minima/RetroMinimaCardContainer";
import {MockPrototypeVaultNodeInterface} from "@component/MockPrototypeVaultNodeInterface";
import {useState} from "react";
import {useEffect} from "react";
import {node} from "@component/MockPrototypeVaultNodeInterface";
import {accountAddress} from "@component/Client";
import * as ColorPalette from "@component/ColorPalette";

export type InputSetter = (input: string) => unknown;

export function GetStarted(): ReactNode {
    let [nameInput, setNameInput] = useState<string>("");
    let [symbolInput, setSymbolInput] = useState<string>("");
    let [tknInput0, setTknInput0] = useState<string>("");
    let [curInput0, setCurInput0] = useState<string>("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359");
    let [tknCurPathInput0, setTknCurPathInput0] = useState<string>("");
    let [curTknPathInput0, setCurTknPathInput0] = useState<string>("");
    let [allocationInput0, setAllocationInput0] = useState<string>("");
    let [tknInput1, setTknInput1] = useState<string>("");
    let [curInput1, setCurInput1] = useState<string>("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359");
    let [tknCurPathInput1, setTknCurPathInput1] = useState<string>("");
    let [curTknPathInput1, setCurTknPathInput1] = useState<string>("");
    let [allocationInput1, setAllocationInput1] = useState<string>("");
    let [deployment, setDeployment] = useState<[[string, string, string[], string[], bigint], [string, string, string[], string[], bigint]] | null>(null);

    useEffect(function(): void {

        interface Address {
            toString(): string;
        }

        function Address(_string: string): Address {
            let _charSet: string[] = [
                "0", "1", "2", "3", "4", 
                "5", "6", "7", "8", "9", 
                "a", "b", "c", "d", "e", 
                "f", "A", "B", "C", "D", 
                "E", "F"
            ];

            /** @constructor */ {
                if (_string.length < 42) throw Error("too-short");
                if (_string.length > 42) throw Error("too-long");
                let stringWithoutInitials: string = "";
                for (let i = 2; i < _string.length; i++) stringWithoutInitials += _string[i];
                _checkCharSet(stringWithoutInitials);
                return {toString};
            }

            function toString(): string {
                return _string.toString();
            }

            function _checkCharSet(string: string): true {
                for (let i = 0; i < string.length; i++) _checkChar(string[i]);
                return true;
            }

            function _checkChar(char: string): true {
                if (char.length !== 1) throw Error("illegal-char");
                for (let i = 0; i < _charSet.length; i++) if (char === _charSet[i]) return true;
                throw Error("illegal-char-set");
            }
        }

        interface Path {
            toString(): string;
            toStringArray(): string[];
            toAddressArray(): Address[];
        }

        function Path(_string: string): Path {
            let _shards: string[];
            /** @constructor */ {
                _shards = _string.split(",");
                for (let i = 0; i < _shards.length; i++) Address(_shards[i]);
                return {toString, toStringArray, toAddressArray};
            }
            
            function toString(): string {
                return _string;
            }

            function toStringArray(): string[] {
                return _shards;
            }

            function toAddressArray(): Address[] {
                let array: Address[] = [];
                for (let i = 0; i < _shards.length; i++) array.push(Address(_shards[i]));
                return array;
            }
        }

        interface Asset {
            toSolStruct(): [string, string, string[], string[], bigint];
            tkn(): Address;
            cur(): Address;
            tknCurPath(): Path;
            curTknPath(): Path;
            allocation(): bigint;
        }

        function Asset({
            _tknInput,
            _curInput,
            _tknCurPathInput,
            _curTknPathInput,
            _allocationInput
        }: {
            _tknInput: string;
            _curInput: string;
            _tknCurPathInput: string;
            _curTknPathInput: string;
            _allocationInput: string;
        }): Asset {
            let _tkn: Address;
            let _cur: Address;
            let _tknCurPath: Path;
            let _curTknPath: Path;
            let _allocation: bigint;

            /** @constructor */ {
                _tkn = Address(_tknInput);
                _cur = Address(_curInput);
                _tknCurPathInput === ""
                    ? _tknCurPath = Path(`${_tknInput},${_curInput}`)
                    : _tknCurPath = Path(_tknCurPathInput);
                _curTknPathInput === ""
                    ? _curTknPath = Path(`${_curInput},${_tknInput}`)
                    : _curTknPath = Path(_curTknPathInput);
                _allocation = BigInt(parseFloat(_allocationInput) * 10**18);
                return {toSolStruct, tkn, cur, tknCurPath, curTknPath, allocation};
            }

            function toSolStruct(): [string, string, string[], string[], bigint] {
                return [
                    tkn().toString(),
                    cur().toString(),
                    tknCurPath().toStringArray(),
                    curTknPath().toStringArray(),
                    allocation()
                ];
            }

            function tkn(): Address {
                return _tkn;
            }

            function cur(): Address {
                return _cur;
            }

            function tknCurPath(): Path {
                return _tknCurPath;
            }

            function curTknPath(): Path {
                return _curTknPath;
            }

            function allocation(): bigint {
                return _allocation;
            }
        }

        try {
            let asset0: Asset = Asset({
                _tknInput: tknInput0,
                _curInput: curInput0,
                _tknCurPathInput: tknCurPathInput0,
                _curTknPathInput: curTknPathInput0,
                _allocationInput: allocationInput0
            });
            let asset1: Asset = Asset({
                _tknInput: tknInput1,
                _curInput: curInput1,
                _tknCurPathInput: tknCurPathInput1,
                _curTknPathInput: curTknPathInput1,
                _allocationInput: allocationInput1
            });
            setDeployment([asset0.toSolStruct(), asset1.toSolStruct()])
            return;
        }
        catch (e: unknown) {
            console.error(e);
            return;
        }
    }, [
        nameInput,
        symbolInput,
        tknInput0,
        curInput0,
        tknCurPathInput0,
        curTknPathInput0,
        allocationInput0,
        tknInput1,
        curInput1,
        tknCurPathInput1,
        curTknPathInput1,
        allocationInput1
    ]);
    
    async function onConfirmButtonClick(): Promise<void> {
        if (!deployment) return;
        try {
            let instance = await _deploy({
                name: nameInput,
                symbol: symbolInput,
                tkn0: deployment[0][0],
                cur0: deployment[0][1],
                tknCurPath0: deployment[0][2],
                curTknPath0: deployment[0][3],
                allocation0: deployment[0][4],
                tkn1: deployment[1][0],
                cur1: deployment[1][1],
                tknCurPath1: deployment[1][2],
                curTknPath1: deployment[1][3],
                allocation1: deployment[1][4]
            });
            console.log(instance);
            return;
        }
        catch (e: unknown) {
            console.error(e);
            return;
        }
    }

    return <>
        <VerticalFlexPage>
            <FlexSlide>
                <FlexSlideLayer style={{background: ColorPalette.OBSIDIAN.toString()}}>
                    <FlexRow style={{width: "1024px", height: "100%", position: "relative"}}>
                        <Blurdot color0={ColorPalette.DEEP_PURPLE.toString()} color1={ColorPalette.OBSIDIAN.toString()} style={{width: "1000px", aspectRatio: "1/1", position: "absolute", right: "300px", bottom: "20px"}}/>
                        <Blurdot color0={ColorPalette.RED.toString()} color1={ColorPalette.OBSIDIAN.toString()} style={{width: "1000px", aspectRatio: "1/1", position: "absolute", left: "300px", top: "20px"}}/>
                    </FlexRow>
                </FlexSlideLayer>
                <FlexSlideLayer style={{justifyContent: "start"}}>
                    <Nav/>
                    <FlexCol style={{width: "1024px", height: "100%", gap: "50px"}}>
                        <FlexRow style={{gap: "20px"}}>

                            <FlexCol style={{height: "100%", gap: "20px", justifyContent: "start"}}>

                                <MetadataForm setNameInput={setNameInput} setSymbolInput={setSymbolInput}/>

                                <FlexRow style={{width: "100%", justifyContent: "space-between"}}>
                                    <RetroMinimaButton caption="Confirm" onClick={onConfirmButtonClick}/>
                                    <RetroMinimaButton caption="Help"/>
                                </FlexRow>
                            </FlexCol>


                            <FlexCol style={{gap: "20px"}}>
                                <AssetForm count="01" setTknInput={setTknInput0} setTknCurPathInput={setTknCurPathInput0} setCurTknPathInput={setCurTknPathInput0} setAllocationInput={setAllocationInput0}/>
                                <AssetForm count="02" setTknInput={setTknInput1} setTknCurPathInput={setTknCurPathInput1} setCurTknPathInput={setCurTknPathInput1} setAllocationInput={setAllocationInput1}/>
                            </FlexCol>
                        </FlexRow>
                    </FlexCol>
                </FlexSlideLayer>
            </FlexSlide>
        </VerticalFlexPage>
    </>;
}

export function MetadataForm({setNameInput, setSymbolInput}: {setNameInput(input: string): unknown; setSymbolInput(input: string): unknown;}): ReactNode {
    return <>
        <FlexCol style={{justifyContent: "start"}}>
            <RetroMinimaCardContainer>
                <FlexCol style={{gap: "20px"}}>
                    <FlexCol style={{width: "100%", gap: "5px", alignItems: "start"}}>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="Metadata"/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="Pick a name and ticker symbol for your DAO." style={{fontSize: "0.5em"}}/></FlexRow>
                    </FlexCol>
                    <FlexCol style={{width: "100%", gap: "10px", alignItems: "start"}}>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="dao-name" placeholder="ETH WBTC 50 50 Fund" setInput={setNameInput} style={{width: "100%"}}/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="dao-symbol" placeholder="5050" setInput={setSymbolInput} style={{width: "100%"}}/></FlexRow>
                    </FlexCol>
                    <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="This will be used to identify your DAO on the blockchain." style={{fontSize: "0.50em"}}/></FlexRow>
                </FlexCol>
            </RetroMinimaCardContainer>
        </FlexCol>
    </>;
}

export function AssetForm({count, setTknInput, setTknCurPathInput, setCurTknPathInput, setAllocationInput}: {count: string; setTknInput: InputSetter; setTknCurPathInput: InputSetter; setCurTknPathInput: InputSetter; setAllocationInput: InputSetter;}): ReactNode {
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
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="token" placeholder="0x0000000000000000000000000000000000000000" setInput={setTknInput} style={{width: "100%"}}/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="token-to-currency-path" placeholder="address,address,address" setInput={setTknCurPathInput} style={{width: "100%"}}/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="currency-to-token-path" placeholder="address,address,address" setInput={setCurTknPathInput} style={{width: "100%"}}/></FlexRow>
                        <FlexRow style={{width: "100%", justifyContent: "start"}}><RetroMinimaInputField caption="allocation" placeholder="50" setInput={setAllocationInput} style={{width: "100%"}}/></FlexRow>
                    </FlexCol>
                    <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content="When rebalanced the contract will make a swap using the paths provided to bring its total assets into balance. The allocation will determine the amount for each position." style={{fontSize: "0.50em"}}/></FlexRow>
                </FlexCol>
            </RetroMinimaCardContainer>
        </FlexCol>
    </>
}

async function _deploy({
    name,
    symbol,
    tkn0,
    cur0,
    tknCurPath0,
    curTknPath0,
    allocation0,
    tkn1,
    cur1,
    tknCurPath1,
    curTknPath1,
    allocation1
}: {
    name: string;
    symbol: string;
    tkn0: string;
    cur0: string;
    tknCurPath0: string[];
    curTknPath0: string[];
    allocation0: bigint;
    tkn1: string;
    cur1: string;
    tknCurPath1: string[];
    curTknPath1: string[];
    allocation1: bigint;
}): Promise<string> {
    let address = await accountAddress();
    let asset0 = [tkn0, cur0, tknCurPath0, curTknPath0, allocation0];
    let asset1 = [tkn1, cur1, tknCurPath1, curTknPath1, allocation1];
    await node.deploy(name, symbol, [(asset0 as any), (asset1 as any)]);
    let children = await node.children();
    let instance = "";
    for (let i = 0; i < children.length; i++) if (children[i].deployer() === address) instance = children[i].instance();
    if (instance === "") throw Error("missing-child");
    return instance;
}