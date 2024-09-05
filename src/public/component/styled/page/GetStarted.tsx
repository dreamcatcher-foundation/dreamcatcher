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
import {Erc20Interface} from "@component/Erc20Interface";
import {useState} from "react";
import {useSpring} from "react-spring";
import {useEffect} from "react";
import * as ColorPalette from "@component/ColorPalette";

export function GetStarted(): ReactNode {
    let [nameInput, setNameInput] = useState<string>("");
    let [symbolInput, setSymbolInput] = useState<string>("");
    
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
                    <FlexCol
                    style={{
                        gap: "10px"
                    }}>
                        <MetadataForm setNameInput={setNameInput} setSymbolInput={setSymbolInput}/>
                        <AssetForm/>
                        <FlexRow
                        style={{
                            gap: "10px"
                        }}>
                            <RetroMinimaButton
                                caption="Confirm"/>
                            <RetroMinimaButton
                                caption="Restart"/>
                        </FlexRow>
                    </FlexCol>

                </FlexSlideLayer>
            </FlexSlide>
        </VerticalFlexPage>
    </>;
}






export function InputField({caption, placeholder, set}: {caption: string; placeholder: string; set: Function}): ReactNode {
    return <>
        <FlexCol
            style={{
                gap: "10px"
            }}>
            <FlexRow
                style={{
                    width: "100%",
                    justifyContent: "start"
                }}>
                <Typography 
                    content={caption} 
                    style={{fontSize: "0.5em"}}/>
            </FlexRow>
            <FlexRow
                style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: ColorPalette.TITANIUM.toString(),
                    padding: "5px"
                }}>
                <input 
                    type="text" 
                    placeholder={placeholder} 
                    onChange={e => set(e.target.value)} 
                    style={{
                        all: "unset", 
                        width: "200px", 
                        aspectRatio: "10/1", 
                        fontWeight: "bold",
                        fontFamily: "satoshiRegular", 
                        fontSize: "0.5em", 
                        pointerEvents: "auto", 
                        cursor: "text", 
                        color: ColorPalette.TITANIUM.toString(), 
                        paddingLeft: "5px", 
                        paddingRight: "5px"
                    }}/>
            </FlexRow>
        </FlexCol>
    </>;
}

export function MetadataForm({setNameInput, setSymbolInput}: {setNameInput: Function; setSymbolInput: Function;}): ReactNode {
    return <>
        <FlexCol style={{gap: "20px"}}>
            <InputField caption="What do you want to call it?" placeholder="Ocean Token" set={setNameInput}/>
            <InputField caption="Your ticker symbol" placeholder="$OCEAN" set={setSymbolInput}/>
            <InputField caption="Your ticker symbol" placeholder="$OCEAN" set={setSymbolInput}/>
            <InputField caption="Your ticker symbol" placeholder="$OCEAN" set={setSymbolInput}/>
            <InputField caption="Your ticker symbol" placeholder="$OCEAN" set={setSymbolInput}/>
        </FlexCol>
    </>;
}

export function AssetForm(): ReactNode {
    return <>
        <FlexCol style={{gap: "10px"}}>
            <InputField caption="What is the token address?" placeholder="0x0000000000000000000000000000000000000000" set={() => {}}/>
            <InputField caption="The path to traverse to get to the currency?" placeholder="" set={() => {}}/>
            <InputField caption="The path to traverse to get to the token from the currency?" placeholder="" set={() => {}}/>
            <InputField caption="Percentage to allocate to this?" placeholder="" set={() => {}}/>
        </FlexCol>
    </>;
}









export function PathForm({children}: {children?: ReactNode;}) {
    return <>
        <FlexCol style={{width: "200px", height: "800px", gap: "10px"}}>
            <Typography content="Token to Currency Path" style={{fontSize: "0.75em"}}/>
            <PathFormDivider/>
            {children}
            <FlexCol style={{width: "100%", gap: "10px", pointerEvents: "auto", cursor: "pointer"}}>
                <RetroMinimaButton
                caption="H"/>
            </FlexCol>
        </FlexCol>
    </>;
}

export function PathFormDivider(): ReactNode {
    return <><FlexRow style={{width: "100%", height: "1px", opacity: "0.25", background: `linear-gradient(to right, transparent, ${ColorPalette.TITANIUM.toString()}, transparent)`}}/></>;
}



export function PathFormItem({address}: {address: string;}): ReactNode {
    return <>
        <FlexCol style={{width: "100%", gap: "10px"}}>
            <FlexRow style={{gap: "10px"}}>
                <PathFormItemAddress address={address}/>
                <PathFormItemSymbol address={address}/>
            </FlexRow>
            <PathFormItemDownArrow/>
            <PathFormDivider/>
        </FlexCol>
    </>;
}

export function PathFormItemAddress({address}: {address: string;}): ReactNode {
    let [addressFormatted, setAddressFormatted] = useState<string>("");

    useEffect(function(): void {
        let addressFormatted: string = "";
        if (!address.startsWith("0x")) {
            addressFormatted += "0x";
        }
        if (address.length < 40) {
            for (let i = 0; i < 40; i += 1) {
                let char: string = address[i];
                if (!char) {
                    addressFormatted += "0";
                }
                else {
                    addressFormatted += char;
                }
            }
        }
        if (address.length > 40) {
            for (let i = 0; i < 40; i += 1) {
                let char: string = address[i];
                addressFormatted += char;
            }
        }
        setAddressFormatted(addressFormatted);
        return;
    }, []);

    return <><FlexRow style={{width: "100%"}}><Typography content={addressFormatted} style={{fontSize: "0.5em"}}/></FlexRow></>;
}

export function PathFormItemSymbol({address}: {address: string;}): ReactNode {
    let [symbol, setSymbol] = useState<string>("");
    
    useEffect(function(): void {
        (async function(): Promise<void> {
            try {
                setSymbol(await Erc20Interface(address).symbol());
                return;
            }
            catch (e: unknown) {
                setSymbol("");
                return;
            }
        })();
        return;
    }, []);

    return <>{symbol.length !== 0 ? <FlexRow style={{width: "100%", justifyContent: "start"}}><Typography content={symbol} style={{fontSize: "0.5em"}}/></FlexRow> : <></>}</>;
}

export function PathFormItemDownArrow(): ReactNode {
    return <><Typography content="▼" style={{fontSize: "0.5em"}}/></>;
}


export function PathFormButton(): ReactNode {
    return <>
        <FlexRow style={{paddingLeft: "2.5px", paddingRight: "2.5px", background: ColorPalette.TITANIUM.toString(), justifyContent: "start"}}>
            <Typography content="Add Path" style={{fontSize: "0.75em", color: ColorPalette.OBSIDIAN.toString()}}/>
        </FlexRow>
    </>;
}



