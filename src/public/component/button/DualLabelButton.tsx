import type {ReactNode} from "react";
import type {FlexColProps} from "@component/FlexColProps";
import {FlexCol} from "@component/FlexCol";
import {FlexRow} from "@component/FlexRow";
import {Typography} from "@component/Typography";
import {createMachine as Machine} from "xstate";
import {useMachine} from "@xstate/react";
import {useMemo} from "react";
import {useSpring} from "react-spring";
import {config} from "react-spring";
import {textShadowGlow} from "@component/TextShadowGlow";
import * as ColorPalette from "@component/ColorPalette";

export type DualLabelButtonProps
    =
    & Omit<FlexColProps, "onClick">
    & {
        label0: string;
        label1: string;
        size: number;
        color: string;
        onClick: Function;
    };

export function DualLabelButton(props: DualLabelButtonProps): ReactNode {
    let {label0, label1, size, color, onClick, style, ... more} = props;
    let [spring0, setSpring0] = useSpring(() => ({
        top: "0px",
        opacity: "0",
        textShadow: textShadowGlow(color, 0.25),
        config: config.stiff
    }));
    let [spring1, setSpring1] = useSpring(() => ({
        top: `${size}px`,
        opacity: "1",
        textShadow: textShadowGlow(color, 0),
        config: config.stiff
    }));
    let [spring2, setSpring2] = useSpring(() => ({
        opacity: "0"
    }));
    let [_, setDualLabelButton] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiVAewFdYwBRfAFzACcBtABgC6iUAAc6sXO1x18wkAA9EAJj4BWEgE4lADgCMugMwA2Y6qUHtAGhABPZXyUldO3QBZX2h6o0+jAXz9rNCw8QlIsKQA3GnomMAAZMHRo-iEkEDEJKRk5RQQVdS09QxMjMwtrOwRdMxI+VyNtLQNVI2cAdgMAoIwcAmISCNxo6kwKXEwAa1S5TMlpWXS8iyMSIyM+DV1tAxUjVxrKxD06jQN21zP27SMlXVuAwJB8Ogg4OWC+sNnxeZylxAAWiMRwQwO6IE+oQG5CoPyyC1yiFcSlB9wMJCU7XaunqSlcLVM7QhUP64UwUTA8L+i1Ayw2mO0BNU2jM2nafAMZzRJ1uqgcmy5+hqjz8QA */
        initial: "idle",
        states: {
            idle: {
                entry: () => {
                    setSpring0.start({
                        top: "0px", 
                        opacity: "1", 
                        textShadow: textShadowGlow(color, 0.25)
                    });
                    setSpring1.start({
                        top: `${size}px`, 
                        opacity: "0", 
                        textShadow: textShadowGlow(color, 0)
                    });
                    setSpring2.start({opacity: "0"});
                    return;
                },
                on: {
                    mouseEnter: "active"
                }
            },
            active: {
                entry: () => {
                    setSpring0.start({
                        top: `${size}px`, 
                        opacity: "0",
                        textShadow: textShadowGlow(color, 0)
                    });
                    setSpring1.start({
                        top: "0px", 
                        opacity: "1",
                        textShadow: textShadowGlow(color, 0.25)
                    });
                    setSpring2.start({opacity: "0.025"});
                    return;
                },
                on: {
                    mouseLeave: "idle",
                    click: {
                        actions: () => onClick(),
                        target: "active"
                    }
                }
            }
        }
    }), [setSpring0, setSpring1, setSpring2]));
    return <>
        <FlexCol
        onMouseEnter={() => setDualLabelButton({type: "mouseEnter"})}
        onMouseLeave={() => setDualLabelButton({type: "mouseLeave"})}
        onClick={(e) => setDualLabelButton({type: "click", e: e})}
        style={{
            width: `${size}px`,
            aspectRatio: "4/1",
            borderColor: ColorPalette.GHOST_IRON.toString(),
            borderWidth: "1px",
            borderStyle: "solid",
            pointerEvents: "auto",
            cursor: "pointer",
            overflow: "hidden",
            background: ColorPalette.SOFT_OBSIDIAN.toString(),
            justifyContent: "center",
            alignItems: "center",
            overflowX: "hidden",
            overflowY: "hidden",
            position: "relative",
            ... style ?? {}
        }}
        {... more}>
            <FlexCol
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                overflowX: "hidden",
                overflowY: "hidden",
                background: "white",
                ... spring2
            }}/>

            <FlexCol
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                overflowX: "hidden",
                overflowY: "hidden"
            }}>
                <FlexRow
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    overflowX: "hidden",
                    overflowY: "hidden"
                }}>
                    <Typography
                    content={label0}
                    style={{
                        fontSize: size / 8,
                        position: "relative",
                        zIndex: "1",
                        ... spring0
                    }}/>
                </FlexRow>

                <FlexRow
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    overflowX: "hidden",
                    overflowY: "hidden"
                }}>
                    <Typography
                    content={label1}
                    style={{
                        fontSize: size / 8,
                        position: "relative",
                        zIndex: "2",
                        ... spring1
                    }}/>
                </FlexRow>
            </FlexCol>
        </FlexCol>
    </>;
}