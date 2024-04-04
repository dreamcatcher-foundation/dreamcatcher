import {stream} from "../../../core/Stream.tsx";
import React, {type CSSProperties, useEffect, useState} from "react";
import {animated, useSpring} from "react-spring";

export interface RemoteProps {
    name: string;
    spring?: object;
    style?: CSSProperties;
    children?: JSX.Element | (JSX.Element)[];
    className?: string;
    [key: string]: any;
}

export default function Remote(props: RemoteProps) {
    let {
        name,
        spring: propsSpring,
        style: propsStyle,
        children,
        className: propsClassName,
        ...other
    } = props;
    propsSpring = propsSpring ?? {};
    propsStyle = propsStyle ?? {};
    propsClassName = propsClassName ?? "";

    const [spring, setSpring] = useState([{}, {}]);
    const [style, setStyle] = useState({});
    const [className, setClassName] = useState(propsClassName);

    useEffect(function() {
        stream.subscribe({
            event: `${name} render spring`,
            task: function(to: object) {
                setSpring(currSpring => [currSpring[1], {
                    ...currSpring[1],
                    ...to
                }]);
            }
        });
        stream.subscribe({
            event: `${name} render style`,
            task: function(to: object) {
                setStyle(currStyle => ({
                    ...currStyle,
                    ...to
                }));
            }
        });
        stream.subscribe({
            event: `${name} get spring`,
            task: function() {
                stream.post({
                    event: `${name} spring`,
                    data: spring
                });
            }
        });
        stream.subscribe({
            event: `${name} get style`,
            task: function() {
                stream.post({
                    event: `${name} style`,
                    data: style
                });
            }
        });
        stream.subscribe({
            event: `${name} set className`,
            task: function(className: string) {
                setClassName(className);
            }
        });
        if (propsSpring) {
            stream.renderSpring({name: name, spring: propsSpring});
        }
        if (propsStyle) {
            stream.renderStyle({name: name, style: propsStyle});
        }
        return function() {
            stream.wipe({event: `${name} render spring`});
            stream.wipe({event: `${name} render style`});
            stream.wipe({event: `${name} get spring`});
            stream.wipe({event: `${name} get style`});
            stream.wipe({event: `${name} set className`});
        }
    }, []);

    return <animated.div className={className} style={{...useSpring({from: spring[0], to: spring[1]}), ...style}} {...other} children={children}/>;
}