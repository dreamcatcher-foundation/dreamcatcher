import type { ReactNode } from "react";
import type { ColProps } from "@component/Col";
import { Col } from "@component/Col";
import { Row, type RowProps } from "@component/Row";
import { U } from "@lib/RelativeUnit";
import { Text } from "@component/Text";
import { useState } from "react";
import { animated } from "react-spring";
import { useSpring } from "react-spring";
import { config } from "react-spring";
import * as ColorPalette from "@component/ColorPalette";

export interface ExplorePageCardProps extends ColProps {
    address: string;
}

export function ExplorePageCard(props: ExplorePageCardProps): ReactNode {
    let { address, style, children, ... more } = props;
    let [name, setName] = useState<string>("****");
    let [symbol, setSymbol] = useState<string>("****");
    let [totalAssets, setTotalAssets] = useState<number>(0);
    let [totalSupply, setTotalSupply] = useState<number>(0);
    let [quote, setQuote] = useState<number>(0);
    let [percentageChange, setPercentageChange] = useState<number>(0);
    let [mounted, setMounted] = useState<ReactNode>(<ExplorePageCardProfileSlide/>);
    return <>
        <Col
        style={{
            width: U(25),
            aspectRatio: "2/1",
            borderRadius: U(0.25),
            borderColor: ColorPalette.GHOST_IRON.toString(),
            borderWidth: U(0.1),
            borderStyle: "solid",
            background: ColorPalette.DARK_OBSIDIAN.toString(),
            padding: U(1),
            justifyContent: "start",
            ... style
        }}
        { ... more }>
            { mounted }
        </Col>
    </>;
}

export interface ExplorePageCardProfileSlideProps extends ColProps {}

export function ExplorePageCardProfileSlide(props: ExplorePageCardProfileSlideProps): ReactNode {
    let { children } = props;
    return <>
        <Col
        style={{
            width: "100%",
            height: "100%"
        }}>
            { children }
        </Col>
    </>;
}

export interface ExplorePageCardProfileSlideHeaderProps extends RowProps {}

export function ExplorePageCardProfileSlideHeader({ children }:{ children?: ReactNode; }): ReactNode {
    return <>
        <Row
        style={{
            width: "100%",
            height: "auto",
            justifyContent: "start",
            gap: U(1)
        }}>

        </Row>
    </>;
}

export function ExplorePageCardProfileSlideHeaderName() {

}

export function ExplorePageCardTransactionSlide() {}

export function ExplorePageCardTransactionReceiptSlide(): ReactNode {
    return <>

    </>;
}



export namespace ExplorePageCards {
    export namespace LoaderSlide {
        export function render(): ReactNode {
            return <>
            </>;
        }
    }
    export namespace ProfileSlide {
        export namespace Header {
            export namespace Name {
                export type Props = {
                    name: string;
                }
                export function render(props: Props): ReactNode {
                    return <>

                    </>;
                }
            }
            export type Props = RowProps & {}
            export function render(props: Props): ReactNode {
                let { style, ... more } = props;
                return <>
                    <Row
                    style={{
                        width: "100%",
                        height: "20%",
                        justifyContent: "start",
                        gap: U(1)
                    }}
                    {... more }/>
                </>;
            }
        }
        export type Props = ExplorePageCard.ProfileSlide.Header.Props & {
            name: string;
            symbol: string;
        };
        export function render(props: Props): ReactNode {
            let { name, symbol } = props;
            return <>
                <ExplorePageCard.ProfileSlide.Header.render>
                    <ExplorePageCard.ProfileSlide.Header.Name.render
                    name={ name }/>
                </ExplorePageCard.ProfileSlide.Header.render>
            </>;
        }
    }
    export namespace TransactionSlide {
        export function render(): ReactNode {
            return <>
            </>;
        }
    }
    export namespace TransactionReceiptSlide {
        export function render(): ReactNode {
            return <>
            </>;
        }
    }
    export namespace TransactionFailureSlide {
        export function render(): ReactNode {
            return <>
            </>;
        }
    }
    export type Props = ColProps & {
        address: string;
    }
    export function render(props: Props) {
        let { address, style, children, ... more } = props;
        let [name, setName] = useState<string>("****");
        let [symbol, setSymbol] = useState<string>("****");
        let [totalAssets, setTotalAssets] = useState<number>(0);
        let [totalSupply, setTotalSupply] = useState<number>(0);
        let [quote, setQuote] = useState<number>(0);
        let [percentageChange, setPercentageChange] = useState<number>(0);
        let [mounted, setMounted] 
            = useState<ReactNode>(
                <ExplorePageCard.ProfileSlide.render 
                name={ name } 
                symbol={ symbol }/>
            );
        return <>
            <Col
            style={{
                width: U(25),
                aspectRatio: "2/1",
                borderRadius: U(0.25),
                borderColor: ColorPalette.GHOST_IRON.toString(),
                borderWidth: U(0.1),
                borderStyle: "solid",
                background: ColorPalette.DARK_OBSIDIAN.toString(),
                padding: U(1),
                justifyContent: "start",
                ... style
            }}
            { ... more }>
                { mounted }
            </Col>
        </>;
    }
}


export interface ExplorePageCardProps extends ColProps {}

export function ExplorePageCard(props: ExplorePageCardProps): ReactNode {
    /** @state */
    let { address, style, children, ... more } = props;
    let [daoName, setDaoName] = useState<string>("****");
    let [daoTokenSymbol, setDaoTokenSymbol] = useState<string>("****");
    let [daoTotalAssets, setDaoTotalAssets] = useState<number>(0);
    let [daoTotalSupply, setDaoTotalSupply] = useState<number>(0);
    let [daoTokenQuote, setDaoTokenQuote] = useState<number>(0);
    let [daoTokenQuotePercentageChange, setDaoTokenQuotePercentageChange] = useState<number>(0);
    let [slide, setSlide] = useState<ReactNode>(<_ProfileSlide/>);

    /** @render */
    return <>
        <Col
        style={{
            width: U(25),
            aspectRatio: "2/1",
            borderRadius: U(0.25),
            borderColor: ColorPalette.GHOST_IRON.toString(),
            borderWidth: U(0.1),
            borderStyle: "solid",
            background: ColorPalette.DARK_OBSIDIAN.toString(),
            padding: U(1),
            justifyContent: "start",
            ... style
        }}
        { ... more }>
            { slide }
        </Col>
    </>;

    /** @component */
    function _ProfileSlide(): ReactNode {

        /** @render */
        return <>
            <_Header/>
            <_SubHeader/>
        </>;

        /** @component */
        function _Header(): ReactNode {

            /** @render */
            return <>
                <Row
                style={{
                    width: "100%",
                    height: "20%",
                    justifyContent: "start",
                    gap: U(1)
                }}>
                    <_DaoName/>
                    <_DaoTokenSymbol/>
                </Row>
            </>;

            /** @component */
            function _DaoName(): ReactNode {

                /** @render */
                return <>
                
                </>;
            }

            /** @component */
            function _DaoTokenSymbol(): ReactNode {

                /** @render */
                return <>
                
                </>;
            }
        }

        /** @component */
        function _SubHeader(): ReactNode {}
    }

    /** @component */
    function _TransactionSlide(): ReactNode {}

    /** @component */
    function _TransactionReceiptSlide(): ReactNode {}

    /** @component */
    function _TransactionFailureSlide(): ReactNode {}

    /** @component */
    function _LoaderSlide(): ReactNode {}

    /** @private */
    function _glow(color: string, strength: number): string {
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
}