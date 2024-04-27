import type {CSSProperties} from "react";
import React, {useState, useEffect} from "react";
import {on, post, render, cleanup, EventSubscription} from "../operator/Emitter.ts";
import {Rendered, RenderedText} from "./Rendered_.tsx";
import {Col, Row} from "./Base.tsx";

export type ICheckBoxProps = ({
    nodeId: string;
    scale?: bigint;
    color?: string;
    style?: CSSProperties;
    [k: string]: any;
});

export function CheckBox(props: ICheckBoxProps) {
    const {nodeId, scale, color, style, ...more} = props;

    const [state, setState] = useState<boolean>(false);

    useEffect(function() {
        const subs: EventSubscription[] = ([
            on({
                recipient: nodeId,
                message: "StateRequest",
                handler: () => state
            }),
            on({
                recipient: nodeId,
                message: "RenderStateRequest",
                handler: function() {
                    if (!state) {
                        render({
                            recipient: nodeId,
                            spring: ({
                                opacity: "1"
                            })
                        });

                        setState(true);

                        post({
                            sender: nodeId,
                            message: "ToggledOn"
                        })

                        return;
                    }

                    render({
                        recipient: nodeId,
                        spring: ({
                            opacity: "0"
                        })
                    });

                    setState(false);

                    post({
                        sender: nodeId,
                        message: "ToggledOff"
                    });

                    return;
                }
            })
        ]);

        return cleanup(subs);
    }, []);

    const args = ({
        style: ({
            width: `${Number(scale ?? 25)}px`,
            height: `${Number(scale ?? 25)}px`,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#A3A3A3",
            ...style ?? ({})
        }),
        ...more
    }) as const;

    const dotArgs = ({
        nodeId: nodeId,
        initialSpring: ({
            opacity: "0"
        }),
        initialStyle: ({
            width: "50%",
            height: "50%",
            borderRadius: "50px",
            background: color ?? "#A3A3A3",
            boxShadow: `0px 0px 16px 2px ${color ?? "#A4A4A4"}`
        }),
        onMouseEnter: () => render({
            recipient: nodeId,
            spring: ({
                cursor: "pointer"
            })
        }),
        onMouseLeave: () => render({
            recipient: nodeId,
            spring: ({
                cursor: "auto"
            })
        }),
        onClick: function() {
            if (!state) {
                render({
                    recipient: nodeId,
                    spring: ({
                        opacity: "1"
                    })
                });

                setState(true);

                post({
                    sender: nodeId,
                    message: "ToggledOn"
                })

                return;
            }

            render({
                recipient: nodeId,
                spring: ({
                    opacity: "0"
                })
            });

            setState(false);

            post({
                sender: nodeId,
                message: "ToggledOff"
            });

            return;
        }
    }) as const;

    return (
        <Col {...args}>
            <Rendered {...dotArgs}></Rendered>
        </Col>
    );
}

export type IInputProps = ({
    nodeId: string;
    placeholder?: string;
    [k: string]: any;
});

export function Input(props: IInputProps) {
    const {nodeId, placeholder, ...more} = props;

    const args = ({
        style: ({
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            fontSize: "8px",
            color: "white"
        }),
        ...more
    }) as const;

    const inputArgs = ({
        style: ({
            width: "100%",
            height: "auto",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#5B5B5B",
            background: "#161616",
            fontSize: "15px",
            fontFamily: "roboto mono",
            fontWeight: "bold",
            color: "white",
            padding: "12px",
            textShadow: "4px 4px 64px 8px #FFFFFF"
        }),
        placeholder: placeholder ?? "",
        onChange: (event: any) => post({
            sender: nodeId,
            message: "Input",
            data: event.target.value
        })
    }) as const;

    return (
        <Row {...args}>
            <input {...inputArgs}></input>
        </Row>
    );
}