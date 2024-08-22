import type { ReactNode } from "react";
import { U } from "@lib/RelativeUnit";
import { Ok } from "@lib/Result";
import { Err } from "@lib/Result";
import { Col } from "@component/Col";
import { Row } from "@component/Row";
import { Text } from "src/public/component_/text/Text";
import { Image } from "src/public/component_/misc/Image";
import { useState } from "react";
import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { createMachine as Machine } from "xstate";
import { useSpring } from "react-spring";
import { config } from "react-spring";
import { PagePreConnectTemplate } from "src/public/component_/layout/template/PagePreConnectTemplate";
import * as ColorPalette from "src/public/component_/config/ColorPalette";
import * as Account from "@lib/Account.tsx";

export function ExplorePage(): ReactNode {
    return <>
        <PagePreConnectTemplate
        content={ <ExplorePageContent/> }
        background={ <ExplorePageBackground/> }/>
    </>;
}

export function ExplorePageContent(): ReactNode {
    return <>
        <Row
        style={{
            gap: U(2)
        }}>
            <ExplorePageCard daoAddress="999"/>
            <ExplorePageCard daoAddress="999"/>
            <ExplorePageCard daoAddress="999"/>
        </Row>
        <Row
        style={{
            gap: U(2)
        }}>
            <ExplorePageCard daoAddress="999"/>
            <ExplorePageCard daoAddress="999"/>
            <ExplorePageCard daoAddress="999"/>
        </Row>
        <Row
        style={{
            gap: U(2)
        }}>
            <ExplorePageCard daoAddress="999"/>
            <ExplorePageCard daoAddress="999"/>
            <ExplorePageCard daoAddress="999"/>
        </Row>
    </>;
}

export function ExplorePageBackground(): ReactNode {
    return <>
        <Col
        style={{
            width: "100%",
            height: "100%",
            background: ColorPalette.OBSIDIAN.toString()
        }}/>
    </>;
}


interface ExplorePageCardDaoQuote {
    real: number;
    best: number;
    slippage: number;
}

function Quotee(_: ExplorePageCardDaoQuote): ExplorePageCardDaoQuote {
    return _;
}

interface ExplorePageCardDao {
    name: string;
    symbol: string;
    totalAssets: ExplorePageCardDaoQuote;
    totalSupply: number;
    quote: ExplorePageCardDaoQuote;
}

export function ExplorePageCardDao() {

}

class Quote {
    public best: number;
    public real: number;
    public slippage: number;
    public constructor({
        best,
        real,
        slippage
    }:{
        best: number;
        real: number;
        slippage: number;
    }) {
        this.best = best;
        this.real = real;
        this.slippage = slippage;
    }
}

class Dao {
    public address: string;
    public name: string;
    public symbol: string;
    public totalAssets: Quote;
    public totalSupply: number;
    public quote: Quote;
    public constructor({
        address,
        name,
        symbol,
        totalAssets,
        totalSupply,
        quote
    }:{
        address: string;
        name: string;
        symbol: string;
        totalAssets: Quote;
        totalSupply: number;
        quote: Quote;
    }) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.totalAssets = totalAssets;
        this.totalSupply = totalSupply;
        this.quote = quote;
    }
}

export function ExplorePageCard({
    daoAddress
}:{
    daoAddress: string;
}): ReactNode {
    const [slide, setSlide] = useState<ReactNode>();
    const [dao, setDao] = useState<Dao>(
        new Dao({
            address: "",
            name: "",
            symbol: "",
            totalAssets: new Quote({
                best: 0,
                real: 0,
                slippage: 0
            }),
            totalSupply: 0,
            quote: new Quote({
                best: 0,
                real: 0,
                slippage: 0
            })
        })
    );
    const [daoName, setDaoName] = useState<string>("****");
    const [daoSymbol, setDaoSymbol] = useState<string>("****");
    const [daoRealTotalAssets, setDaoRealTotalAssets] = useState<number>(0);
    const [daoTotalSupply, setDaoTotalSupply] = useState<number>(0);
    const [daoQuote, setDaoQuote] = useState<number>(0);
    const [daoQuote24HrPercentageChange, setDaoQuote24HrPercentageChange] = useState<number>(0);
    const [_, setExplorePageCard] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBsB7dCAqAYlgFdNM5YBtABgF1FQAHCrFwAXXBXx8QAD0QAmABwBWEgBYFARjkA2VZzkBmJUY0AaEAE9EGgJw2S2jQHYncuUu0Gn2pwYC+fuZoWHiEpJTUtHQAZui4ZIwATmBcvEgggsJiElKyCIoq6lq6+kYm5lYIGgYaJM5KnJzKBqpuSgpOAUEYOATEJADucSJ0EBIpPFKZouKS6XkGTSQ2nDYGCqpK1a2+FYiaJKte6qXGTqo2XSDBvWEkuBBkYHSoBCIAQowiIhIAwmS4TAAa1SUyEMxy80QHichzkGgUnnhHQM2j2+U42kOBhxm0cShs2gUl0C1x6oX6DyedAARkl8J9vn8AcDQelptk5qA8jC4QikQjfGjLNZVLDjDYlG0NJxbE4tgFSfgKBA4FIbhSiGCsrNcogALTCyqGw6NM3ms3wq4avrhKg0fBQbUQrkyazwkhKYwaWw6MWreXomUqHwIhQ1eXaFbKa3k22DYbOzl6hB6BSHNbyoyqXQKBTomyqEgKQxrVStVrEjyxkLxqlgJO6qGpgxyZZyJqopEKRq7EVVOzLH05laqRZ2JQ1279V74EQAFUS6HwsCwnIAYhREqhG5DuYhzunGjV1CWbPDOKp0R2sa2nJixwidmOp5qSHTEvhF8vV5gN1ud3ZcFk2bQ9TRPPM5HPGUr37DQxWLHE5HvTZ4JQ194zAaQwEwL5aAAWTeb8VzXJsBGAsi3VTORrxlEh5TWbQtl0Tx1G0RU-CAA */
        initial: "loading",
        states: {
            loading: {
                entry: () => {
                    setSlide(<ExplorePageCardLoaderSlide/>);
                    (async () => {
                        const daoName:
                            | Ok<unknown>
                            | Account.NotConnectedErr
                            | Err<unknown> 
                            = await Account.query({
                                to: daoAddress,
                                signature: "function name() external view returns (string)",
                            });
                        const daoSymbol:
                            | Ok<unknown>
                            | Account.NotConnectedErr
                            | Err<unknown>
                            = await Account.query({
                                to: daoAddress,
                                signature: "function symbol() external view returns (string)"
                            });
                        const daoTotalAssets:
                            | Ok<unknown>
                            | Account.NotConnectedErr
                            | Err<unknown>
                            = await Account.query({
                                to: daoAddress,
                                signature: "function totalAssets() external view returns (uint256)"
                            });
                        const daoTotalSupply:
                            | Ok<unknown>
                            | Account.NotConnectedErr
                            | Err<unknown>
                            = await Account.query({
                                to: daoAddress,
                                signature: "function totalSupply() external view returns (uint256)"
                            });
                        const daoQuote:
                            | Ok<unknown>
                            | Account.NotConnectedErr
                            | Err<unknown>
                            = await Account.query({
                                to: daoAddress,
                                signature: "function quote() external view returns (uint256, uint256, uint256)"
                            });
                        if (
                            daoName.err ||
                            daoSymbol.err ||
                            daoTotalAssets.err ||
                            daoTotalSupply.err ||
                            daoQuote.err
                        ) return setExplorePageCard({ type: "failure" });
                        if (
                            typeof daoName.unwrap() !== "string" ||
                            typeof daoSymbol.unwrap() !== "string" ||
                            typeof daoTotalAssets.unwrap() !== "bigint" ||
                            typeof daoTotalSupply.unwrap() !== "bigint" ||
                            typeof daoQuote.unwrap() !== "bigint"
                        ) return setExplorePageCard({ type: "failure" });
                        const uDaoName: string = daoName.unwrap() as string;
                        const uDaoSymbol: string = daoSymbol.unwrap() as string;
                        const uDaoTotalAssets: bigint = daoTotalAssets.unwrap() as bigint;
                        const uDaoTotalSupply: bigint = daoTotalSupply.unwrap() as bigint;
                        const uDaoQuote: bigint = daoQuote.unwrap() as bigint;
                        setDaoName(uDaoName);
                        setDaoSymbol(uDaoSymbol);
                        setDaoRealTotalAssets(toHumanReadableNumber(uDaoTotalAssets));
                        setDaoTotalSupply(toHumanReadableNumber(uDaoTotalSupply));
                        setDaoQuote(toHumanReadableNumber(uDaoQuote));
                        function toHumanReadableNumber(bigint: bigint): number {
                            return Number(bigint) / 10**18;
                        }
                        return setExplorePageCard({ type: "success" });
                    })();
                    return;
                },
                on: {
                    success: "idle",
                    failure: "wait"
                }
            },
            wait: {
                entry: () => {
                    const ms: number = 1000;
                    return setTimeout(() => {
                        return setExplorePageCard({ type: "done "});
                    }, ms);
                },
                on: {
                    done: "loading"
                }
            },
            idle: {
                entry: () => {
                    return setSlide(<>
                        <ExplorePageCardIdleSlide
                        daoAddress={ daoAddress }
                        daoName={ daoName }
                        daoSymbol={ daoSymbol }
                        daoTotalAssets={ daoRealTotalAssets }
                        daoTotalSupply={ daoTotalSupply }
                        daoQuote={ daoQuote }
                        daoQuote24HrPercentageChange={ daoQuote24HrPercentageChange }/>
                    </>);
                },
                on: {
                    mintButtonClick: "mintTransactionForm",
                    burnButtonClick: "burnTransactionForm"
                }
            },
            mintTransactionForm: {

            },
            burnTransactionForm: {

            },
            executingMintTransaction: {}
        }
    }), [setSlide, setDaoName, setDaoSymbol, setDaoRealTotalAssets, setDaoTotalSupply, setDaoQuote, setDaoQuote24HrPercentageChange]));
    return <>
        <Col
        style={{
            width: U(25),
            aspectRatio: "2/1",
            borderRadius: U(0.25),
            borderColor: ColorPalette.GHOST_IRON.toString(),
            borderWidth: U(0.1),
            borderStyle: "solid",
            background: ColorPalette.SOFT_OBSIDIAN.toString(),
            padding: U(1),
            justifyContent: "center",
            alignItems: "center"
        }}>
            { slide }
        </Col>
    </>;
}

export function ExplorePageCardLoaderSlide(): ReactNode {
    return <>
        <Image
        src="../../../img/animation/loader/Infinity.svg"
        style={{
            width: U(5),
            aspectRatio: "1/1"
        }}/>
    </>;
}

export function ExplorePageCardIdleSlide({
    daoAddress,
    daoName,
    daoSymbol,
    daoTotalAssets,
    daoTotalSupply,
    daoQuote,
    daoQuote24HrPercentageChange
}:{
    daoAddress: string;
    daoName: string;
    daoSymbol: string;
    daoTotalAssets: number;
    daoTotalSupply: number;
    daoQuote: number;
    daoQuote24HrPercentageChange: number;

}): ReactNode {
    return <>

    </>;
}

export function ExplorePageCardDualLabelButton({
    symbolChar,
    symbolCharColor,
    label,
    onClick
}:{
    symbolChar: string;
    symbolCharColor: string;
    label: string;
    onClick: () => Promise<unknown>;
}): ReactNode {
    const [hiddenWrapperSpring, setHiddenWrapperSpring] = useSpring(() => ({
        width: U(1),
        height: U(1),
        top: U(-1.5),
        gap: U(1.75),
        config: config.stiff
    }));
    const [symbolSpring, setSymbolSpring] = useSpring(() => ({
        opacity: "0",
        config: config.stiff
    }));
    const [labelSpring, setLabelSpring] = useSpring(() => ({
        opacity: "1",
        config: config.stiff
    }));
    const [_, setExplorePageCardDualLabelButton] = useMachine(useMemo(() => Machine({
        initial: "idle",
        states: {
            idle: {
                entry: (_, e: unknown) => {
                    setHiddenWrapperSpring.start({ top: U(-1.5) });
                    setSymbolSpring.start({ opacity: "0" });
                    setLabelSpring.start({ opacity: "1" });
                    return;
                },
                on: {
                    mouseEnter: "hover"
                }
            },
            hover: {
                entry: (_, e: unknown) => {
                    setHiddenWrapperSpring.start({ top: U(1.5) });
                    setSymbolSpring.start({ opacity: "1" });
                    setLabelSpring.start({ opacity: "0" });
                    return;
                },
                on: {
                    mouseLeave: "idle",
                    click: "click"
                }
            },
            click: {
                entry: (_, e: unknown) => {
                    console.log("I was clicked");
                    onClick();
                    setExplorePageCardDualLabelButton({ type: "done" });
                },
                on: {
                    done: "hover"
                }
            }
        }
    }), [setHiddenWrapperSpring, setSymbolSpring, setLabelSpring]));
    function glow(color: string, strength: number): string {
        let strength0: number = strength * 1;
        let strength1: number = strength * 2;
        let strength2: number = strength * 3;
        let strength3: number = strength * 4;
        let strength4: number = strength * 5;
        let strength5: number = strength * 6;
        let distance0: U = U(strength0);
        let distance1: U = U(strength1);
        let distance2: U = U(strength2);
        let distance3: U = U(strength3);
        let distance4: U = U(strength4);
        let distance5: U = U(strength5);
        let shadow0: string = `0 0 ${ distance0 } ${ color }`;
        let shadow1: string = `0 0 ${ distance1 } ${ color }`;
        let shadow2: string = `0 0 ${ distance2 } ${ color }`;
        let shadow3: string = `0 0 ${ distance3 } ${ color }`;
        let shadow4: string = `0 0 ${ distance4 } ${ color }`;
        let shadow5: string = `0 0 ${ distance5 } ${ color }`;
        return `${ shadow0 }, ${ shadow1 }, ${ shadow2 }, ${ shadow3 }, ${ shadow4 }, ${ shadow5 }`;
    }
    return <>
        <Col
        onMouseEnter={ () => setExplorePageCardDualLabelButton({ type: "mouseEnter" }) }
        onMouseLeave={ () => setExplorePageCardDualLabelButton({ type: "mouseLeave"}) }
        onClick={ () => setExplorePageCardDualLabelButton({ type: "click" }) }
        style={{
            width: U(7.5),
            aspectRatio: "4/1",
            borderColor: ColorPalette.GHOST_IRON.toString(),
            borderWidth: U(0.1),
            borderStyle: "solid",
            borderRadius: U(0.25),
            pointerEvents: "auto",
            cursor: "pointer",
            overflow: "hidden",
            background: "transparent"
        }}>
            <Col
            style={{
                position: "relative",
                ... hiddenWrapperSpring
            }}>
                <Text
                text={ symbolChar }
                style={{
                    fontSize: U(1),
                    fontWeight: "bold",
                    fontFamily: "satoshiRegular",
                    color: symbolCharColor,
                    textShadow: glow(symbolCharColor, 1),
                    ... symbolSpring
                }}/>
                <Text
                text={ label }
                style={{
                    fontSize: U(1),
                    fontWeight: "bold",
                    fontFamily: "satoshiRegular",
                    color: ColorPalette.TITANIUM.toString(),
                    position: "relative",
                    bottom: U(0.1),
                    ... labelSpring
                }}/>
            </Col>
        </Col>
    </>;
}