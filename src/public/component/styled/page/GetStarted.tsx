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
    let [deployment, setDeployment] = useState();

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
                if (`${_string[0]}${_string[1]}` !== "0x") throw Error("missing-prefix");
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
        }) {
            let _tkn: Address;
            let _cur: Address;
            let _tknCurPath: Path;
            let _curTknPath: Path;
            let _allocation: bigint;

            /** @constructor */ {
                _tkn = Address(_tknInput);
                _cur = Address(_curInput);
                _tknCurPath = Path(_tknCurPathInput);
                _curTknPath = Path(_curTknPathInput);
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
            let asset0 = Asset({
                _tknInput: tknInput0,
                _curInput: curInput0,
                _tknCurPathInput: tknCurPathInput0,
                _curTknPathInput: curTknPathInput0,
                _allocationInput: allocationInput0
            });
            
        }
        catch (e: unknown) {

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
    
    async function deploy(): Promise<string | null> {
        try {

            class Address {
                private static _charSet: string[] = [
                    "0", "1", "2", "3", "4", 
                    "5", "6", "7", "8", "9", 
                    "a", "b", "c", "d", "e", 
                    "f", "A", "B", "C", "D", 
                    "E", "F", "x"
                ];

                private static _checkCharSet(string: string): true {
                    for (let i = 0; i < string.length; i++) Address._checkChar(string[i]);
                    return true;
                }

                private static _checkChar(char: string): true {
                    if (char.length !== 1) throw new Error("address-illegal-char");
                    for (let i = 0; i < Address._charSet.length; i++) if (char === Address._charSet[i]) return true;
                    throw new Error("address-illegal-char-set");
                }

                public constructor(private _string: string) {
                    let initial: string = this._string[0] + this._string[1];
                    if (initial !== "0x") throw new Error("address-illegal-prefix");
                    if (this._string.length < 42) throw new Error("address-too-short");
                    if (this._string.length > 42) throw new Error("address-too-long");
                    Address._checkCharSet(this._string);
                }

                public toString(): string {
                    return this._string;
                }
            }

            class Path {
                private _addressArray: Address[] = [];

                public constructor(private _stringArray: string[]) {
                    for (let i = 0; i < this._stringArray.length; i++) this._addressArray.push(new Address(this._stringArray[i]));
                }

                public toAddressArray(): Address[] {
                    return [... this._addressArray];
                }

                public toStringArray(): string[] {
                    return [... this._stringArray];
                }
            }
            class Asset {
                private _tkn: Address;
                private _cur: Address;
                private _tknCurPath: Path;
                private _curTknPath: Path;
                private _allocation: bigint;

                public constructor({
                    tknInput,
                    curInput,
                    tknCurPathInput,
                    curTknPathInput,
                    allocationInput
                }: {
                    tknInput: string;
                    curInput: string;
                    tknCurPathInput: string;
                    curTknPathInput: string;
                    allocationInput: string;
                }) {
                    let tknCurPathShards: string[] = tknCurPathInput.split(",");
                    let curTknPathShards: string[] = curTknPathInput.split(",");
                    if (tknCurPathInput === "") tknCurPathShards = [tknInput, curInput];
                    if (curTknPathInput === "") curTknPathShards = [curInput, tknInput];
                    this._tkn = new Address(tknInput);
                    this._cur = new Address(curInput);
                    this._tknCurPath = new Path(tknCurPathShards);
                    this._curTknPath = new Path(curTknPathShards);
                    this._allocation = BigInt(parseFloat(allocationInput) * 10**18)
                }

                public toDeploymentPayload(): [string, string, string[], string[], bigint] {
                    return [
                        this._tkn.toString(), 
                        this._cur.toString(), 
                        this._tknCurPath.toStringArray(), 
                        this._curTknPath.toStringArray(), 
                        this._allocation
                    ];
                }

                public tkn(): Address {
                    return this._tkn;
                }

                public cur(): Address {
                    return this._cur;
                }

                public tknCurPath(): Path {
                    return this._tknCurPath;
                }

                public curTknPath(): Path {
                    return this._curTknPath;
                }

                public allocation(): bigint {
                    return this._allocation;
                }
            }
            let asset0 = new Asset({
                tknInput: tknInput0,
                curInput: curInput0,
                tknCurPathInput: tknCurPathInput0,
                curTknPathInput: curTknPathInput0,
                allocationInput: allocationInput0
            });
            let asset1 = new Asset({
                tknInput: tknInput1,
                curInput: curInput1,
                tknCurPathInput: tknCurPathInput1,
                curTknPathInput: curTknPathInput1,
                allocationInput: allocationInput1
            });
            let node = MockPrototypeVaultNodeInterface("0x79AE495ce6832182B62e6B9340f1eF887269C38c");
            let receipt = await node.deploy(nameInput, symbolInput, [asset0.toDeploymentPayload(), asset1.toDeploymentPayload()]);
            if (receipt) return receipt.contractAddress;
            return null;
        }
        catch (e: unknown) {
            console.error(e);
            return null;
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
                                    <RetroMinimaButton caption="Confirm" onClick={() => deploy()}/>
                                    <RetroMinimaButton caption="Help"/>
                                </FlexRow>
                            </FlexCol>


                            <FlexCol style={{gap: "20px"}}>
                                <AssetForm count="01" setTknInput={setTknInput0} setTknCurPathInput={setTknCurPathInput0} setCurTknPathInput={setCurTknPathInput0} setAllocationInput={setAllocationInput0}/>
                                <AssetForm count="02" setTknInput={setCurInput1} setTknCurPathInput={setTknCurPathInput1} setCurTknPathInput={setCurTknPathInput1} setAllocationInput={setAllocationInput1}/>
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