import type {ReactNode} from "react";
import {Col} from "@component/Col";
import {Text} from "src/public/component_/text/Text";
import {U} from "@lib/RelativeUnit";
import {createMachine as Machine} from "xstate";
import {useMachine} from "@xstate/react";
import {useMemo} from "react";
import {useSpring} from "react-spring";
import {config} from "react-spring";

export interface DualLabelButtonProps {
    label0: string;
    label1: string;
    fontWeight: string;
    fontFamily: string;
    backgroundColor: string;
    borderColor: string;
    color: string;
    size: number;
    onClick: Function;
}

export function DualLabelButton(props: DualLabelButtonProps): ReactNode {
    let {
        label0, 
        label1,
        fontWeight, 
        fontFamily,
        backgroundColor,
        borderColor,
        color, 
        size,
        onClick,
        ... more
    } = props;
    let [spring0, setSpring0] = useSpring(() => ({
        width: size,
        height: size * 2,
        top: -size,
        gap: size / 2,
        config: config.stiff
    }));
    let [spring1, setSpring1] = useSpring(() => ({
        opacity: "0",
        config: config.stiff
    }));
    let [spring2, setSpring2] = useSpring(() => ({
        opacity: "1",
        config: config.stiff
    }));
    let [_, setDualLabelButton] = useMachine(useMemo(() => Machine({
        initial: "idle",
        states: {
            idle: {
                entry: () => {
                    setSpring0.start({top: -size});
                    setSpring1.start({opacity: "0"});
                    setSpring1.start({opacity: "1"});
                    return;
                },
                on: {
                    mouseEnter: "hovering"
                }
            },
            hovering: {
                entry: () => {
                    setSpring0.start({top: 0});
                    setSpring1.start({opacity: "1"});
                    setSpring2.start({opacity: "0"});
                    return;
                },
                on: {
                    click: {
                        target: "hovering",
                        actions: () => onClick()
                    },
                    mouseLeave: "idle"
                }
            }
        }
    }), [setSpring0, setSpring1, setSpring2]));
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
    return <>
        <Col
        onMouseEnter={() => setDualLabelButton({type: "mouseEnter"})}
        onMouseLeave={() => setDualLabelButton({type: "mouseLeave"})}
        onClick={() => setDualLabelButton({type: "click"})}
        style={{
            width: `${size}px`,
            aspectRatio: "4/1",
            borderColor,
            borderWidth: "1px",
            borderStyle: "solid",
            pointerEvents: "auto",
            cursor: "pointer",
            overflow: "hidden",
            background: backgroundColor,
        }}
        {... more}>
            <Col
            style={{
                position: "relative",
                ... spring0
            }}>
                <Text
                text={label0}
                style={{
                    fontSize: size * 0.25,
                    fontWeight,
                    fontFamily,
                    color,
                    textShadow: _glow(color, 1),
                    ... spring1
                }}/>
                <Text
                text={label1}
                style={{
                    fontSize: size * 0.25,
                    fontWeight,
                    fontFamily,
                    color,
                    textShadow: _glow(color, 1),
                    ... spring2
                }}/>
            </Col>
        </Col>
    </>;
}