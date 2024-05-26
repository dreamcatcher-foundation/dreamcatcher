import React from "react";
import type {CSSProperties} from "react";
import Col from "../base/Col.tsx";
import Text from "../base/Text.tsx";

export default function RetroMinimaTaggedMiniContainer({
    text,
    style,
    children,
    ...more}: {
        text: string;
        style?: CSSProperties;
        children?: React.JSX.Element | (React.JSX.Element)[];
        [key: string]: any;}): React.JSX.Element {
    return <Col {...{
        "style": {
            "position": "relative",
            ...style ?? {}
        },
        "children": [
            <Col {...{ /** Content */
                "style": {
                    "width": "100%",
                    "height": "100%",
                    "position": "absolute",
                    "borderWidth": "1px",
                    "borderStyle": "solid",
                    "borderColor": "#505050",
                    "padding": "15px"
                },
                "children": children
            }}/>,
            <Col {...{  /** Tag Wrapper */
                "style": {
                    "width": "100%",
                    "height": "100%",
                    "position": "absolute",
                    "display": "flex",
                    "flexDirection": "column",
                    "justifyContent": "start",
                    "background": "transparent"
                },
                "children": [
                    <Col {...{ /** Dark Tag Container */
                    "style": {
                        "width": "auto",
                        "height": "auto",
                        "background": "#161616",
                        "position": "relative",
                        "bottom": "5px"
                    },
                    "children": [
                        <Col {...{ /** Tag Container */
                            "style": {
                                "width": "auto",
                                "height": "auto",
                                "background": "#D6D5D4",
                                "paddingLeft": "2px",
                                "paddingRight": "2px",
                                "marginLeft": "10px",
                                "marginRight": "10px"
                            },
                            "children": [
                                <Text {...{
                                    "text": text,
                                    "style": {
                                        "width": "auto",
                                        "height": "auto",
                                        "background": "#161616",
                                        "fontSize": ".75em"
                                    }
                                }}/>
                            ]
                        }}/>
                    ]
                }}/>
                ]
            }}/>
        ],
        ...more
    }}/>
}