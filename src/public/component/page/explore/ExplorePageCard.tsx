import type { ReactNode } from "react";
import type { ColProps } from "@component/Col";
import { Col } from "@component/Col";
import { Row } from "@component/Row";
import { U } from "@lib/RelativeUnit";
import { Text } from "@component/Text";
import { useState } from "react";
import { animated } from "react-spring";
import { useSpring } from "react-spring";
import { config } from "react-spring";
import * as ColorPalette from "@component/ColorPalette";

export interface ExplorePageCardProps extends ColProps {}

export function ExplorePageCard(props: ExplorePageCardProps): ReactNode {
    const _MAX_STRING_LENGTH: number = 32;
    let { style, ... more } = props;
    let [name, setName] = useState("This is a really long name for a really big address");
    let [symbol, setSymbol] = useState("****");
    let [quote, setQuote] = useState(0);
    function _Card({ children }:{ children?: ReactNode }): ReactNode {
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
                { children }
            </Col>
        </>;
    }
    function _Header({ children }:{ children?: ReactNode }): ReactNode {
        return <>
            <Row
            style={{
                width: "100%",
                height: "20%",
                justifyContent: "start",
                gap: U(1)
            }}>
                { children }
            </Row>
        </>;
    }
    function _HeaderName(): ReactNode {
        function _name(): string {
            if (name.length > _MAX_STRING_LENGTH) return name.substring(0, _MAX_STRING_LENGTH - 3) + "..."; 
            return name;
        }
        return <>
            <animated.div
            style={{
                fontSize: U(1),
                color: ColorPalette.TITANIUM.toString()
            }}>
                { _name() }
            </animated.div>
        </>;
    }
    function _HeaderSymbol(): ReactNode {
        return <>
            <animated.div
            style={{
                fontSize: U(1),
                color: ColorPalette.TITANIUM.toString()
            }}>
                { symbol }
            </animated.div>
        </>;
    }
    /// sub header is where the address will be shown
    function _SubHeader({ children }:{ children?: ReactNode; }): ReactNode {
        return <>
            <Row
            style={{
                width: "100%",
                height: "10%",
                justifyContent: "start"
            }}>
                { children }
            </Row>
        </>;
    }
    function _SubHeaderAddress(): ReactNode {
        return <>
            <animated.div
            style={{
                fontSize: U(0.75),
                color: ColorPalette.TITANIUM.toString()
            }}>
                0x0000000000000000000000000000000000000000
            </animated.div>
        </>;
    }
    function _Content({ children }:{ children?: ReactNode; }): ReactNode {
        return <>
            <Row
            style={{
                gap: U(1)
            }}>
                { children }
            </Row>
        </>;
    }
    function _ContentQuote(): ReactNode {
        return <>
            <animated.div
            style={{
                fontSize: U(2),
                fontFamily: "satoshiRegular",
                color: ColorPalette.TITANIUM.toString()
            }}>
                { "$" + quote.toFixed(8) }
            </animated.div>
        </>;
    }
    function _ContentQuotePnlPercentage(): ReactNode {
        return <>
            <animated.div
            style={{
                fontSize: U(0.8),
                fontFamily: "satoshiRegular",
                color: ColorPalette.RED.toString()
            }}>
                +24.42%
            </animated.div>
        </>;
    }
    function _ButtonGroup(): ReactNode {
        let _starSymbolChar: string = "✦";
        function _Wrapper({ children }:{ children?: ReactNode; }): ReactNode {
            return <>
                <Row>
                    { children }
                </Row>
            </>;
        }
        function _MintButton(): ReactNode {
            let [symbol, setSymbol] = useSpring(() => ({ opacity: "0", config: config.stiff }));
            let [label, setLabel] = useSpring(() => ({ opacity: "1", config: config.stiff }));
            let [hiddenWrapper, setHiddenWrapper] 
                = useSpring(() => ({
                    width: U(1),
                    height: U(1),
                    top: U(-1.5),
                    gap: U(1.5),
                    config: config.stiff
                }));
            function _Container({ children }:{ children?: ReactNode; }): ReactNode {
                return <>
                    <Col
                    onMouseEnter={ () => {
                        setHiddenWrapper.start({ top: U(1.5) });
                        setSymbol.start({ opacity: "1" });
                        setLabel.start({ opacity: "0" });
                        return;    
                    } }
                    onMouseLeave={ () => {
                        setHiddenWrapper.start({ top: U(-1.5) });
                        setSymbol.start({ opacity: "0" });
                        setLabel.start({ opacity: "1" });
                        return;
                    } }
                    onClick={ () => {
                        
                    } }
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
                        { children }
                    </Col>
                </>;
            }
            function _HiddenWrapper({ children }:{ children?: ReactNode; }): ReactNode {
                return <>
                    <Col
                    style={{
                        position: "relative",
                        ... hiddenWrapper
                    }}>
                        { children }
                    </Col>
                </>;
            }
            function _Symbol(): ReactNode {
                return <>
                    <Text
                    text={ _starSymbolChar }
                    style={{
                        fontSize: U(1),
                        fontWeight: "bold",
                        fontFamily: "satoshiRegular",
                        color: "green",
                        textShadow: _glow("green", 1),
                        ... symbol
                    }}/>
                </>;
            }
            function _Label(): ReactNode {
                return <>
                    <Text
                    text="Deposit"
                    style={{
                        fontSize: U(1),
                        color: ColorPalette.TITANIUM.toString(),
                        ... label
                    }}/>
                </>;
            }
            return <>
                <_Container>
                    <_HiddenWrapper>
                        <_Symbol/>
                        <_Label/>
                    </_HiddenWrapper>
                </_Container>
            </>;
        }
        function _BurnButton(): ReactNode {
            return <>
                
            </>;
        }
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
        return <>
            <_Wrapper>
                <_MintButton/>
                <_BurnButton/>
            </_Wrapper>
        </>;
    }
    return <>
        <_Card>
            <_Header>
                <_HeaderName/>
                <_HeaderSymbol/>
            </_Header>
            <_SubHeader>
                <_SubHeaderAddress/>
            </_SubHeader>
            <_Content>
                <_ContentQuote/>
                <_ContentQuotePnlPercentage/>
            </_Content>
            <_ButtonGroup/>
        </_Card>
    </>;
}