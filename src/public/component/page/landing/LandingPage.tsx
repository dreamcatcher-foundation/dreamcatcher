import type {ReactNode} from "react";
import {PageTemplate} from "@component/PageTemplate";
import {Col} from "@component/Col";
import {Row} from "@component/Row";
import {Text} from "@component/Text";
import {Blurdot} from "@component/Blurdot";
import {Image} from "@component/Image";
import {U} from "@lib/RelativeUnit";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMemo} from "react";
import {useMachine} from "@xstate/react";
import {useState} from "react";
import {config} from "react-spring";
import * as ColorPalette from "@component/ColorPalette";
import React from "react";

export function LandingPage() : ReactNode {
	return <>
		<PageTemplate
			hlen={1n}
			vlen={1n}
			content={<>
			<LandingPageContentWrapper>
				<LandingPageBlockWithButtonGroup
					button0Label0="ᐉ"
					button0Label1="Get Started"
					button1Label0="ᐉ"
					button1Label1="Learn More"
					headingText="Shape the enterprise"
					headingFontSize={U(3)}
					headingFontWeight="bold"
					headingFontFamily="satoshiRegular"
					headingColor={ColorPalette.TITANIUM.toString()}
					subHeadingText="Some subheading i think"
					subHeadingFontSize={U(1)}
					subHeadingFontWeight="bold"
					subHeadingFontFamily="satoshiRegular"
					subHeadingColor={ColorPalette.TITANIUM.toString()}/>
				<LandingPageContentKeyPointsSectionContainer
					backgroundColor0={ColorPalette.SOFT_OBSIDIAN.toString()}
					backgroundColor1={ColorPalette.OBSIDIAN.toString()}>
					<LandingPageContentKeyPointsSectionCard
						width={U(20)}
						height="auto"
						src="../../../img/shape/Dots.svg"
						caption="Transparent"
						captionFontSize={U(1)}
						captionFontWeight="bold"
						captionFontFamily="satoshiRegular"
						captionColor={ColorPalette.TITANIUM.toString()}
						description="Finance should be for everyone and everyone should be able to have ownership. Every single transaction is registered and trusless."
						descriptionFontSize={U(0.6)}
						descriptionFontWeight="bold"
						descriptionFontFamily="satoshiRegular"
						descriptionColor={ColorPalette.TITANIUM.toString()}/>
					<LandingPageContentKeyPointsSectionCard
						width={U(20)}
						height="auto"
						src="../../../img/shape/Dots.svg"
						caption="Transparent"
						captionFontSize={U(1)}
						captionFontWeight="bold"
						captionFontFamily="satoshiRegular"
						captionColor={ColorPalette.TITANIUM.toString()}
						description="Finance should be for everyone and everyone should be able to have ownership. Every single transaction is registered and trusless."
						descriptionFontSize={U(0.6)}
						descriptionFontWeight="bold"
						descriptionFontFamily="satoshiRegular"
						descriptionColor={ColorPalette.TITANIUM.toString()}/>
					<LandingPageContentKeyPointsSectionCard
						width={U(20)}
						height="auto"
						src="../../../img/shape/Dots.svg"
						caption="Transparent"
						captionFontSize={U(1)}
						captionFontWeight="bold"
						captionFontFamily="satoshiRegular"
						captionColor={ColorPalette.TITANIUM.toString()}
						description="Finance should be for everyone and everyone should be able to have ownership. Every single transaction is registered and trusless."
						descriptionFontSize={U(0.6)}
						descriptionFontWeight="bold"
						descriptionFontFamily="satoshiRegular"
						descriptionColor={ColorPalette.TITANIUM.toString()}/>
				</LandingPageContentKeyPointsSectionContainer>
			</LandingPageContentWrapper>
			</>}
			background={<>
			
			</>}/>
	</>;
}

export function LandingPageContentWrapper({
	children
} : {
	children? : ReactNode;
}) : ReactNode {
	return <>
		<Col
		style={{
			width: "100%",
			height: "100%",
			justifyContent: "start"
		}}>
			{ children }
		</Col>
	</>;
}

export function LandingPageContentKeyPointsSectionContainer({
	backgroundColor0,
	backgroundColor1,
	children
} : {
	backgroundColor0 : string;
	backgroundColor1 : string;
	children ?: ReactNode;
}) : ReactNode {
	return <>
		<Row
		style={{
			width: U(100),
			height: U(10),
			background: `linear-gradient(to right, ${ backgroundColor0 }, ${ backgroundColor1 })`,
			justifyContent: "space-around",
			alignItems: "center"
		}}>
			{ children }
		</Row>
	</>;
}

export function LandingPageContentKeyPointsSectionCard({
    width,
    height,
    src,
    caption,
    captionFontSize,
    captionFontWeight,
    captionFontFamily,
    captionColor,
    description,
    descriptionFontSize,
    descriptionFontWeight,
    descriptionFontFamily,
    descriptionColor
}:{
    width: string;
    height: string;
    src: string;
    caption: string;
    captionFontSize: string;
    captionFontWeight: string;
    captionFontFamily: string;
    captionColor: string;
    description: string;
    descriptionFontSize: string;
    descriptionFontWeight: string;
    descriptionFontFamily: string;
    descriptionColor: string;
}): ReactNode {
    return <>
        <Row
            style={{
                width: width,
                height: height,
                gap: U(1)
            }}>
            <Col
                style={{
                    height: "100%"
                }}>
                <Image
                    src={ src }
                    style={{
                        width: U(7.5),
                        aspectRatio: "1/1"
                    }}/>
            </Col>
            <Col
            style={{
                width: "100%",
                height: "100%",
                justifyContent: "start"
            }}>
                <Row
                style={{
                    width: "100%",
                    height: "auto",
                    justifyContent: "start"
                }}>
                    <Text
                    text={ caption }
                    style={{
                        fontSize: captionFontSize,
                        fontWeight: captionFontWeight,
                        fontFamily: captionFontFamily,
                        color: captionColor,
                        whiteSpace: "pretty"
                    }}/>
                </Row>
                <Row
                style={{
                    width: "100%",
                    height: "auto",
                    justifyContent: "start",
                    alignItems: "start"
                }}>
                    <Text
                    text={ description }
                    style={{
                        fontSize: descriptionFontSize,
                        fontWeight: descriptionFontWeight,
                        fontFamily: descriptionFontFamily,
                        color: descriptionColor
                    }}/>
                </Row>
            </Col>
        </Row>
    </>;
}

export function LandingPageBackground(): ReactNode {
    return <>
        <Col
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            background: ColorPalette.OBSIDIAN.toString()
        }}>
            <Blurdot
            color0={ ColorPalette.DEEP_PURPLE.toString() }
            color1={ ColorPalette.OBSIDIAN.toString() }
            style={{
                width: U(500),
                aspectRatio: "1/1",
                position: "absolute",
                right: U(100)
            }}/>
            <Blurdot
            color0="#0652FE"
            color1={ ColorPalette.OBSIDIAN.toString() }
            style={{
                width: U(500),
                aspectRatio: "1/1",
                position: "absolute",
                left: U(100)
            }}/>
        </Col>
    </>;
}

export function LandingPageBlockWithButtonGroup({
    headingText,
    headingFontSize = U(3),
    headingFontWeight = "bold",
    headingFontFamily = "satoshiRegular",
    headingColor = ColorPalette.TITANIUM.toString(),
    subHeadingText,
    subHeadingFontSize = U(2),
    subHeadingFontWeight = "bold",
    subHeadingFontFamily = "satoshiRegular",
    subHeadingColor = ColorPalette.TITANIUM.toString(),
    button0Label0 = "",
    button0Label1 = "",
    button0LabelColor0 = ColorPalette.GHOST_IRON.toString(),
    button0LabelColor1 = ColorPalette.TITANIUM.toString(),
    button0FontSize = U(1),
    button0FontWeight = "bold",
    button0FontFamily = "satoshiRegular",
    button0BorderColor = ColorPalette.GHOST_IRON.toString(),
    button0OnClick = async () => {},
    button1Label0 = "",
    button1Label1 = "",
    button1LabelColor0 = ColorPalette.GHOST_IRON.toString(),
    button1LabelColor1 = ColorPalette.TITANIUM.toString(),
    button1FontSize = U(1),
    button1FontWeight = "bold",
    button1FontFamily = "satoshiRegular",
    button1BorderColor = ColorPalette.GHOST_IRON.toString(),
    button1OnClick = async () => {}
}:{
    headingText: string;
    headingFontSize: string;
    headingFontWeight: string;
    headingFontFamily: string;
    headingColor: string;
    subHeadingText: string;
    subHeadingFontSize: string;
    subHeadingFontWeight: string;
    subHeadingFontFamily: string;
    subHeadingColor: string;
    button0Label0?: string;
    button0Label1?: string;
    button0LabelColor0?: string;
    button0LabelColor1?: string;
    button0FontSize?: string;
    button0FontWeight?: string;
    button0FontFamily?: string;
    button0BorderColor?: string;
    button0OnClick?: () => Promise<unknown>;
    button1Label0?: string;
    button1Label1?: string;
    button1LabelColor0?: string;
    button1LabelColor1?: string;
    button1FontSize?: string;
    button1FontWeight?: string;
    button1FontFamily?: string;
    button1BorderColor?: string;
    button1OnClick?: () => Promise<unknown>;
}): ReactNode {
    return <>
        <LandingPageBlockWrapper>
            <LandingPageBlockContentWrapper>
                <LandingPageBlockHeading
                text={ headingText }
                fontSize={ headingFontSize }
                fontWeight={ headingFontWeight }
                fontFamily={ headingFontFamily }
                color={ headingColor }/>
                <LandingPageBlockSubHeading
                text={ subHeadingText }
                fontSize={ subHeadingFontSize }
                fontWeight={ subHeadingFontWeight }
                fontFamily={ subHeadingFontFamily }
                color={ subHeadingColor }/>
                <LandingPageBlockButtonGroup
                button0Label0={ button0Label0 }
                button0Label1={ button0Label1 }
                button0LabelColor0={ button0LabelColor0 }
                button0LabelColor1={ button0LabelColor1 }
                button0FontSize={ button0FontSize }
                button0FontWeight={ button0FontWeight }
                button0FontFamily={ button0FontFamily }
                button0BorderColor={ button0BorderColor }
                button0OnClick={ button0OnClick }
                button1Label0={ button1Label0 }
                button1Label1={ button1Label1 }
                button1LabelColor0={ button1LabelColor0 }/>
            </LandingPageBlockContentWrapper>
        </LandingPageBlockWrapper>
    </>;
}

export function LandingPageBlockButtonGroup({
    button0Label0 = "",
    button0Label1 = "",
    button0LabelColor0 = ColorPalette.GHOST_IRON.toString(),
    button0LabelColor1 = ColorPalette.TITANIUM.toString(),
    button0FontSize = U(1),
    button0FontWeight = "bold",
    button0FontFamily = "satoshiRegular",
    button0BorderColor = ColorPalette.GHOST_IRON.toString(),
    button0OnClick = async () => {},
    button1Label0 = "",
    button1Label1 = "",
    button1LabelColor0 = ColorPalette.GHOST_IRON.toString(),
    button1LabelColor1 = ColorPalette.TITANIUM.toString(),
    button1FontSize = U(1),
    button1FontWeight = "bold",
    button1FontFamily = "satoshiRegular",
    button1BorderColor = ColorPalette.GHOST_IRON.toString(),
    button1OnClick = async () => {} }:{
        button0Label0?: string;
        button0Label1?: string;
        button0LabelColor0?: string;
        button0LabelColor1?: string;
        button0FontSize?: string;
        button0FontWeight?: string;
        button0FontFamily?: string;
        button0BorderColor?: string;
        button0OnClick?: () => Promise<unknown>;
        button1Label0?: string;
        button1Label1?: string;
        button1LabelColor0?: string;
        button1LabelColor1?: string;
        button1FontSize?: string;
        button1FontWeight?: string;
        button1FontFamily?: string;
        button1BorderColor?: string;
        button1OnClick?: () => Promise<unknown>; }): ReactNode {
    return <>
        <Row
        style={{
            width: "100%",
            justifyContent: "start",
            gap: U(2)
        }}>
            <LandingPageDualLabelButton
            label0={ button0Label0 }
            label1={ button0Label1 }
            labelColor0={ button0LabelColor0 }
            labelColor1={ button0LabelColor1 }
            fontSize={ button0FontSize }
            fontWeight={ button0FontWeight }
            fontFamily={ button0FontFamily }
            borderColor={ button0BorderColor }
            onClick={ button0OnClick }/>
            <LandingPageDualLabelButton
            label0={ button1Label0 }
            label1={ button1Label1 }
            labelColor0={ button1LabelColor0 }
            labelColor1={ button1LabelColor1 }
            fontSize={ button1FontSize }
            fontWeight={ button1FontWeight }
            fontFamily={ button1FontFamily }
            borderColor={ button1BorderColor }
            onClick={ button1OnClick }/>
        </Row>
    </>;
}

export function LandingPageBlock({
    headingText,
    headingFontSize = U(3),
    headingFontWeight = "bold",
    headingFontFamily = "satoshiRegular",
    headingColor = ColorPalette.TITANIUM.toString(),
    subHeadingText,
    subHeadingFontSize = U(2),
    subHeadingFontWeight = "bold",
    subHeadingFontFamily = "satoshiRegular",
    subHeadingColor = ColorPalette.TITANIUM.toString(),
    paragraphText,
    paragraphFontSize = U(0.75),
    paragraphFontWeight = "bold",
    paragraphFontFamily = "satoshiRegular",
    paragraphColor = ColorPalette.TITANIUM.toString(),
    paragraphPadding = U(0.25)
}:{
    headingText: string;
    headingFontSize: string;
    headingFontWeight: string;
    headingFontFamily: string;
    headingColor: string;
    subHeadingText: string;
    subHeadingFontSize: string;
    subHeadingFontWeight: string;
    subHeadingFontFamily: string;
    subHeadingColor: string;
    paragraphText: string;
    paragraphFontSize: string;
    paragraphFontWeight: string;
    paragraphFontFamily: string;
    paragraphColor: string;
    paragraphPadding: string;
}): ReactNode {
    return <>
        <LandingPageBlockWrapper>
            <LandingPageBlockContentWrapper>
                <LandingPageBlockHeading
                    text={ headingText }
                    fontSize={ headingFontSize }
                    fontWeight={ headingFontWeight }
                    fontFamily={ headingFontFamily }
                    color={ headingColor }/>
                <LandingPageBlockSubHeading
                    text={ subHeadingText }
                    fontSize={ subHeadingFontSize }
                    fontWeight={ subHeadingFontWeight }
                    fontFamily={ subHeadingFontFamily }
                    color={ subHeadingColor }/>
                <LandingPageBlockParagraph
                    text={ paragraphText }
                    fontSize={ paragraphFontSize }
                    fontWeight={ paragraphFontWeight }
                    fontFamily={ paragraphFontFamily }
                    color={ paragraphColor }
                    padding={ paragraphPadding }/>
            </LandingPageBlockContentWrapper>
        </LandingPageBlockWrapper>
    </>;
}

export function LandingPageBlockWrapper({
    children
}:{
    children?: ReactNode;
}): ReactNode {
    return <>
        <Row
        style={{
            width: "100%",
            height: U(30),
            paddingLeft: U(10),
            paddingRight: U(10),
            paddingTop: U(2.5),
            paddingBottom: U(2.5)
        }}>
            { children }
        </Row>
    </>;
}

export function LandingPageBlockContentWrapper({
    children
}:{
    children?: ReactNode;
}): ReactNode {
    return <>
        <Col
        style={{
            width: "auto",
            height: "100%"
        }}>
            { children }
        </Col>
    </>;
}

export function LandingPageBlockHeading({
    text,
    fontSize = U(3),
    fontWeight = "bold",
    fontFamily = "satoshiRegular",
    color = ColorPalette.TITANIUM.toString()
}:{
    text: string;
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    color: string;
}): ReactNode {
    return <>
        <Row
        style={{
            width: "100%",
            height: "auto",
            justifyContent: "start"
        }}>
            <Text
            text={ text }
            style={{
                fontSize,
                fontWeight,
                fontFamily,
                color
            }}/>
        </Row>
    </>;
}

export function LandingPageBlockSubHeading({
    text,
    fontSize = U(2),
    fontWeight = "bold",
    fontFamily = "satoshiRegular",
    color = ColorPalette.TITANIUM.toString()
}:{
    text: string;
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    color: string;
}): ReactNode {
    return <>
        <Row
        style={{
            width: "100%",
            height: "auto",
            justifyContent: "start"
        }}>
            <Text
            text={ text }
            style={{
                fontSize,
                fontWeight,
                fontFamily,
                color
            }}/>
        </Row>
    </>;
}

export function LandingPageBlockParagraph({
    text,
    fontSize = U(0.75),
    fontWeight = "bold",
    fontFamily = "satoshiRegular",
    color = ColorPalette.TITANIUM.toString(),
    padding = U(0.25)
}:{
    text: string;
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    color: string;
    padding: string;
}): ReactNode {
    return <>
        <Row
        style={{
            width: "100%",
            height: "auto",
            justifyContent: "start"
        }}>
            <Text
            text={ text }
            style={{
                fontSize,
                fontWeight,
                fontFamily,
                color,
                padding,
                textAlign: "justify"
            }}/>
        </Row>
    </>;
}

export function LandingPageBlockImage({
    src,
    size
}:{
    src: string;
    size: U;
}): ReactNode {
    return <>
        <Image
        src={ src }
        style={{
            width: size,
            aspectRatio: "1/1"
        }}/>
    </>;
}










export function LandingPageDualLabelButton({
	label0,
	label1,
	labelColor0,
	labelColor1,
	fontSize,
	fontWeight,
	fontFamily,
	borderColor,
	onClick
}: {
	label0: string;
	label1: string;
	labelColor0: string;
	labelColor1: string;
	fontSize: string;
	fontWeight: string;
	fontFamily: string;
	borderColor: string;
	onClick: () => Promise<unknown>;
}): ReactNode {
	return <>
		<LandingPageDualLabelButton._
			label0={label0}
			label1={label1}
			labelColor0={labelColor0}
			labelColor1={labelColor1}
			fontSize={fontSize}
			fontWeight={fontWeight}
			fontFamily={fontFamily}
			borderColor={borderColor}
			onClick={onClick}/>
	</>;
}
export module LandingPageDualLabelButton {
	export function _({
		label0,
		label1,
		labelColor0,
		labelColor1,
		fontSize,
		fontWeight,
		fontFamily,
		borderColor,
		onClick
	}: {
		label0: string;
		label1: string;
		labelColor0: string;
		labelColor1: string;
		fontSize: string;
		fontWeight: string;
		fontFamily: string;
		borderColor: string;
		onClick: () => Promise<unknown>;
	}): ReactNode {
		let [hiddenWrapperSpring, setHiddenWrapperSpring] = useSpring(() => ({
			width: U(15),
			height: U(3.75 * 2),
			top: U(-1.5),
			gap: U(1.5),
			config: config.stiff
		}));
		let [symbolSpring, setSymbolSpring] = useSpring(() => ({
			opacity: "0",
			config: config.stiff
		}));
		let [labelSpring, setLabelSpring] = useSpring(() => ({
			opacity: "1",
			config: config.stiff
		}));
		let [_, setLandingPageDualLabelButton] = useMachine(useMemo(() => Machine({
			/** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiVAewFdYwBRfAFzACcBtABgC6iUAAc6sXO1x18wkAA9EAJj4BWEgE4lADgCMAZg0AWAGzat2vgHYANCACeiA7pK6rqvrs8bdJ1Ud0AX0C7NCw8QlJsOgA3bgIoWkZmABkwdDj+ISQQMQkpGTlFBBV1CwNjMwtrO0cEPRI+DX0rAJ19PhNdI21g0IwcAmISaLiuBOpMClxMAGssuTzJaVkc4tUlIxIlXSUNoyUTDWMjVVqnfX0SE3dPb19-IJCQMMHIkimZ2chqCBkwBY5JYFVagdabba7faHY5GU7nepXVTNKwmMwPTxPZ74OgQOByV4RYiLcTLQprRAAWhMCOpfReAyJpHIVBJ+RWRUQBwRWhI+iUhm0+m0Rg0aN2+nphKGUVi8XwUDZZNBCkQ+hMfG2IsMHm6hgFPK22gFGiFIrFXSUUsZMo+0zmkCVIM5CBMAr5Yua-lUHXcPKsfJNZtF4oFwWCQA */
			initial: "idle",
			states: {
				idle: {
					entry: () => {
						setHiddenWrapperSpring.start({top: U(-1.5)});
						setSymbolSpring.start({opacity: "0"});
						setLabelSpring.start({opacity: "1"});
						return;
					},
					on: {
						mouseEnter: "hovering"
					}
				},
				hovering: {
					entry: () => {
						setHiddenWrapperSpring.start({top: U(1.5)});
						setSymbolSpring.start({opacity: "1"});
						setLabelSpring.start({opacity: "0"});
						return;
					},
					on: {
						mouseLeave: "idle",
						click: "clicked"
					}
				},
				clicked: {
					entry: () => {
						(async () => {
							if (onClick) await onClick();
							return setLandingPageDualLabelButton({type: "done"});
						})();
						return;
					},
					on: {
						done: "hovering"
					}
				}
			}
		}), [setHiddenWrapperSpring, setSymbolSpring, setLabelSpring]));
		return <>
			<Container
				setLandingPageDualLabelButton={setLandingPageDualLabelButton}
				borderColor={borderColor}>
				<HiddenWrapper
					spring={hiddenWrapperSpring}>
					<Symbol
						label={label0}
						fontSize={fontSize}
						fontWeight={fontWeight}
						fontFamily={fontFamily}
						color={labelColor0}
						spring={symbolSpring}/>
					<Label
						label={label1}
						fontSize={fontSize}
						fontWeight={fontWeight}
						fontFamily={fontFamily}
						color={labelColor1}
						spring={labelSpring}/>
				</HiddenWrapper>
			</Container>
		</>;
	}
	export function Container({
		setLandingPageDualLabelButton,
		borderColor,
		children
	}: {
		setLandingPageDualLabelButton: Function;
		borderColor: string;
		children?: ReactNode;
	}): ReactNode {
		return <>
			<Col
				onMouseEnter={(): unknown => setLandingPageDualLabelButton({type: "mouseEnter"})}
				onMouseLeave={(): unknown => setLandingPageDualLabelButton({type: "mouseLeave"})}
				onClick={(): unknown => setLandingPageDualLabelButton({type: "click"})}
				style={{
					width: U(15),
					aspectRatio: "4/1",
					borderColor: borderColor ?? ColorPalette.GHOST_IRON.toString(),
					borderWidth: U(0.1),
					borderStyle: "solid",
					borderRadius: U(0.5),
					pointerEvents: "auto",
					cursor: "pointer",
					overflow: "hidden",
					background: ColorPalette.DARK_OBSIDIAN.toString()
				}}>
				{children}
			</Col>
		</>;
	}
	export function HiddenWrapper({
		spring,
		children
	}: {
		spring: object;
		children?: ReactNode;
	}): ReactNode {
		return <>
			<Col
				style={{
					position: "relative",
					... spring
				}}>
					{children}
			</Col>
		</>;
	}
	export function Symbol({
		label,
		fontSize,
		fontWeight,
		fontFamily,
		color,
		spring
	}: {
		label: string;
		fontSize: string;
		fontWeight: string;
		fontFamily: string;
		color: string;
		spring: object;
	}): ReactNode {
		return <>
			<Text
				text={label}
				style={{
					fontSize,
					fontWeight,
					fontFamily,
					color,
					textShadow: _glow(color, 1),
					... spring
				}}/>
		</>;
	}
	export function Label({
		label,
		fontSize,
		fontWeight,
		fontFamily,
		color,
		spring
	}: {
		label: string;
		fontSize: string;
		fontWeight: string;
		fontFamily: string;
		color: string;
		spring: object;
	}): ReactNode {
		return <>
			<Text
				text={label}
				style={{
					fontSize,
					fontWeight,
					fontFamily,
					color,
					... spring
				}}/>
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
        let shadow0: string = `0 0 ${distance0} ${color}`;
        let shadow1: string = `0 0 ${distance1} ${color}`;
        let shadow2: string = `0 0 ${distance2} ${color}`;
        let shadow3: string = `0 0 ${distance3} ${color}`;
        let shadow4: string = `0 0 ${distance4} ${color}`;
        let shadow5: string = `0 0 ${distance5} ${color}`;
        return `${shadow0}, ${shadow1}, ${shadow2}, ${shadow3}, ${shadow4}, ${shadow5}`;
    }
}