import type {ReactNode} from "react";
import {Nav} from "@component/Nav";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {Erc20Interface} from "@component/Erc20Interface";
import {Typography} from "@component/Typography";
import {Sprite} from "@component/Sprite";
import {PieChart} from "recharts";
import {Pie} from "recharts";
import {LabelList} from "recharts";
import {useEffect} from "react";
import {useState} from "react";
import {accountAddress} from "@component/Client";
import * as ColorPalette from "@component/ColorPalette";

let dream: Erc20Interface = Erc20Interface("0x52463952A864107B63Eb6b21f5234A0B0e99b3f1");

export function TokenomicsPage(): ReactNode {
    let [totalSupply, setTotalSupply] = useState<number>(0);
    let [balance, setBalance] = useState<number>(0);
    let [quote, setQuote] = useState<number>(0.50);

    useEffect(() => {
        (async () => {
            setTotalSupply(await dream.totalSupply());
            setBalance(await dream.balanceOf(await accountAddress()));
        })();
    }, []);
    
    return <>
        <FlexCol
        style={{
            width: "100vw",
            height: "100vh",
            overflowX: "hidden",
            overflowY: "hidden",
            pointerEvents: "none",
            background: ColorPalette.OBSIDIAN.toString()
        }}>
            <FlexCol
            style={{
                width: "1024px",
                height: "100%",
                justifyContent: "space-between"
            }}>
                <Nav/>

                <FlexRow>
                    <Typography
                    content="Dream"/>
                    <Typography
                    content="$DREAM"/>
                </FlexRow>

                <Typography
                content="Dream is our native token and is required to use the protocol services, however, payments in other currencies are accepted and converted to Dream for a seamless experience. There are 200,000,000 initially minted of which"/>

                <Sprite
                src="../../../img/hodl.svg"
                style={{
                    width: "500px",
                    aspectRatio: "1/1"
                }}/>

                <FlexRow
                style={{
                    gap: "5px"
                }}>
                    <Tag
                    src="../../../img/shape/Flame.svg"
                    content="0.0004"/>
                    <Tag
                    src="../../../img/shape/TwoSquares.svg"
                    content="2595"/>
                    <Tag
                    src="../../../img/shape/Composition.svg"
                    content="2,394,499"/>
                </FlexRow>



                <FlexRow>
                    <Typography
                    content={`TotalSupply: ${totalSupply.toLocaleString()}`}/>
                </FlexRow>
            </FlexCol>

        </FlexCol>
    </>;
}

export function Tag({src, content}) {
    return <>
        <FlexRow
        style={{
            background: ColorPalette.SOFT_OBSIDIAN.toString(),
            padding: "10px",
            gap: "5px",
            borderColor: ColorPalette.GHOST_IRON.toString(),
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "10px"
        }}>
            <Sprite
            src={src}
            style={{
                width: "10px",
                aspectRatio: "1/1"
            }}/>
            <Typography
            content={content}
            style={{
                fontSize: "0.75em"
            }}/>
        </FlexRow>
    </>;
}