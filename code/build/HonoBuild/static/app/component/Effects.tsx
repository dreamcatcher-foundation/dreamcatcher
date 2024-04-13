import type {CSSProperties} from 'react';
import React from 'react';
import {animated, useSpring} from 'react-spring';

export type IPulseLineProps = ({
    style?: CSSProperties;
    [k: string]: any;
});

export function PulseLine(props: IPulseLineProps) {
    const {style, ...more} = props;

    const args = ({
        style: ({
            width: "100%",
            height: "0.50px",
            background: "linear-gradient(to right, transparent, rgba(163, 163, 163, 0.25), transparent)",
            ...style ?? ({})
        }),
        ...more
    }) as const;

    return <div {...args}></div>
}

export type IPulseProps = ({
    delay?: bigint;
    reverse?: boolean;
    style?: CSSProperties;
    [k: string]: any;
});

export function Pulse(props: IPulseProps) {
    const {delay, reverse, style, ...more} = props;

    const from: string = reverse ? "110%" : "-10%";
    const to: string = reverse ? "-10%" : "-110%";
    const dir: string = reverse ? "to left" : "to right";

    const args = ({
        style: style ?? ({})
    }) as const;

    const pulseArgs = ({
        style: ({
            ...useSpring({from: {left: from}, to: {left: to}, delay: Number(delay ?? 0), config: {tension: 5, friction: 4}, loop: true}),
            ...({
                width: "40px",
                height: "2.5px",
                bottom: "1.25px",
                background: `linear-gradient(${dir}, transparent, rgba(163, 163, 163, 0.25))`,
                borderRadius: "25px",
                position: "relative"
            }) as const
        }),
        ...more
    });

    return (
        <PulseLine {...args}>
            <animated.div {...pulseArgs}></animated.div>
        </PulseLine>
    );
}

export function Pulse0() {
    const args = ({
        delay: 4000n,
        style: ({
            position: "relative",
            bottom: "200px"
        }),
        reverse: false
    }) as const;

    return (<Pulse {...args}></Pulse>);
}

export function Pulse1() {
    const args = ({
        delay: 8000n,
        style: ({
            position: "relative"
        }),
        reverse: true
    }) as const;

    return (<Pulse {...args}></Pulse>);
}

export type IBlurDotProps = ({
    color0: string;
    color1: string;
    style?: CSSProperties;
    [k: string]: any;
});

export function BlurDot(props: IBlurDotProps) {
    const {color0, color1, style, ...more} = props;

    const args = ({
        style: ({
            background: `radial-gradient(closest-side, ${color0}, ${color1})`,
            opacity: "0.10",
            ...style
        }),
        ...more
    }) as const;

    return (<animated.div {...args}></animated.div>);
}

export function BlurDot0() {
    const args = ({
        color0: "#615FFF",
        color1: "#161616",
        style: ({
            width: "1000px",
            height: "1000px",
            position: "absolute",
            right: "600px",
            bottom: "200px"
        })
    }) as const;

    return <BlurDot {...args}></BlurDot>
}

export function BlurDot1() {
    const args = ({
        color0: "#0652FE",
        color1: "#161616",
        style: ({
            width: "1000px",
            height: "1000px",
            position: "absolute",
            left: "600px",
            top: "200px"
        })
    }) as const;

    return (<BlurDot {...args}></BlurDot>);
}