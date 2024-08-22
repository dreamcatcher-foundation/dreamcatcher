import type {ReactNode} from "react";
import {PageTemplate} from "src/public/component_/layout/template/PageTemplate";
import {Col} from "@component/Col";
import {Row} from "@component/Row";
import {Text} from "src/public/component_/text/Text";
import {Blurdot} from "src/public/component_/decoration/Blurdot";
import {Image} from "src/public/component_/misc/Image";
import {U} from "@lib/RelativeUnit";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMemo} from "react";
import {useMachine} from "@xstate/react";
import {useState} from "react";
import {config} from "react-spring";
import {animated} from "react-spring";
import * as Config from "src/public/component_/config/Config";
import React from "react";

export function LandingPage(): ReactNode {
	return <>
		<PageTemplate
			background={
				<>
					<Col
					style={{
						"minWidth": "100%",
						"maxWidth": "100%",
						"minHeight": "100%",
						"maxHeight": "100%",
						"background": Config.ColorPalette.obsidian.toString()
					}}/>
				</>
			}
			content={
				<>
					<Col
					style={{
						"display": "grid",
						"gridTemplateRows": "100px 100px 100px 100px",
						"gridTemplateColumns": "100px 100px 100px 100px",
						"minWidth": "100%",
						"maxWidth": "100%",
						"minHeight": "30%",
						"maxHeight": "30%"
					}}>
						<Text
						text="Imons0nu su 0su 0su s0 s"
						style={{
							"fontSize": "50%",
							"fontWeight": "bolder",
							"fontFamily": "satoshiRegular",
							"color": Config.ColorPalette.titanium.toString()
						}}/>
						<Text
						text="ojsjijs0js0js0js0s"
						style={{
							"fontSize": U(2.5),
							"fontWeight": "bold",
							"fontFamily": "satoshiRegular",
							"color": Config.ColorPalette.titanium.toString()
						}}/>
					</Col>
					<Row
					style={{
						"minWidth": U(100),
						"maxWidth": U(100),
						"minHeight": U(20),
						"maxHeight": U(20),
						"background": Config.ColorPalette.softObsidian.toString()
					}}>
						<Row
						style={{
							"minWidth": U(20),
							"maxWidth": U(20),
							"minHeight": U(10),
							"maxHeight": U(10)
						}}>
							<Col
							style={{
								"minWidth": U(10),
								"maxWidth": U(10),
								"minHeight": U(10),
								"maxHeight": U(10)
							}}>
								<Text
								text="My First Point"
								style={{
									"fontSize": U(1),
									"fontWeight": "bold",
									"fontFamily": "satoshiRegular",
									"color": Config.ColorPalette.titanium.toString()
								}}/>
								<Text
								text="J0 sjs dj d d0u d0ud 0ud d0 d0ud 0du ud0uud0 ud 0du 0du0d ud0u0ud du0 ud0ud0 ud0 dud0ud 0u0du d0u0du0d u0d u0du 0du0du 0du0du du d0d"
								style={{
									"fontSize": U(0.75),
									"fontWeight": "normal",
									"fontFamily": "satoshiRegular",
									"color": Config.ColorPalette.titanium.toString()
								}}/>
							</Col>
						</Row>
					</Row>
				</>
			}/>
	</>;
}