import {stream} from "../../../core/Stream.tsx";
import React, {type CSSProperties, useEffect, useState} from "react";
import {type SpringProps, animated, useSpring} from "react-spring";
export default function Remote({tag, spring = {}, style = {}, classname = "", children = [], ...more}: {tag: string; spring?: SpringProps; style?: CSSProperties; classname?: string; children?: JSX.Element | (JSX.Element)[]; [key: string]: any;}) {
    const [spring_, setSpring] = useState<SpringProps[]>([{}, {}]);
    const [style_, setStyle] = useState<CSSProperties>({});
    const [classname_, setClassname] = useState<string>(classname);
    useEffect(function() {
        const renderSpringEvent = `${tag} render spring`;
        const renderStyleEvent = `${tag} render style`;
        const getSpringEvent = `${tag} get spring`;
        const getStyleEvent = `${tag} get style`;
        const setClassnameEvent = `${tag} set classname`;
        const handleRenderSpringEvent = (to: SpringProps) => setSpring(springNow => [springNow[1], {...springNow[1], ...to}]);
        const handleRenderStyleEvent = (to: CSSProperties) => setStyle(styleNow => ({...styleNow, ...to}));
        const handleGetSpringEvent = () => stream.post({event: `${tag} spring`, data: spring_});
        const handleGetStyleEvent = () => stream.post({event: `${tag} style`, data: style_});
        const handleSetClassnameEvent = (classname: string) => setClassname(classname);
        stream.subscribe({event: renderSpringEvent, task: handleRenderSpringEvent});
        stream.subscribe({event: renderStyleEvent, task: handleRenderStyleEvent});
        stream.subscribe({event: getSpringEvent, task: handleGetSpringEvent});
        stream.subscribe({event: getStyleEvent, task: handleGetStyleEvent});
        stream.subscribe({event: setClassnameEvent, task: handleSetClassnameEvent});
        stream.renderSpring({tag: tag, spring: spring});
        stream.renderStyle({tag: tag, style: style});
        function cleanup() {
            stream.wipe({event: renderSpringEvent});
            stream.wipe({event: renderStyleEvent});
            stream.wipe({event: getSpringEvent});
            stream.wipe({event: getStyleEvent});
            stream.wipe({event: setClassnameEvent});
        }
        return cleanup;
    }, []);
    return <animated.div className={classname_} style={{...useSpring({from: spring_[0], to: spring_[1]}), ...style_}} {...more} children={children}/>
}