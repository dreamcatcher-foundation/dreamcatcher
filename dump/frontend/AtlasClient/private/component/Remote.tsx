import {EventEmitter} from "fbemitter";
import {type CSSProperties, useEffect, useState} from "react";
import {on, broadcast} from "../connection/Connection.tsx";
import {type SpringProps, animated, useSpring} from "react-spring";

/**
 * -> A dynamic component that can render based on events on a selected
 *    network. If the network is declared globally or a singleton
 *    then any component can use the network to communicate across
 *    the application.
 * 
 * -> The key event structure is:
 *  
 *          1) ${name}::render::spring
 *          2) ${name}::render::stylesheet
 *          3) ${name}::get::spring
 *          4) ${name}::get::stylesheet
 *          5) ${name}::spring
 *          6) ${name}::stylesheet
 * 
 * -> Remote uses react spring for natural transitions. When a new
 *    spring is given, it will smoothly transition to the new targets which
 *    may be position, color, or more.
 * 
 * -> For properties which are not supported by spring, a stylesheet can be
 *    used to do the same.
 */
export function Remote({name, network, initSpring, initStylesheet, children}: {name: string; network: EventEmitter; initSpring?: SpringProps; initStylesheet?: CSSProperties; children?: JSX.Element | (JSX.Element)[];}) {
    const [spring, _spring] = useState([{}, {}]);
    const [stylesheet, _stylesheet] = useState({});

    useEffect(function() {
        on(network, `${name}::render::spring`, (to: SpringProps) => _spring(currentSpring => [currentSpring[1], {...currentSpring[1], ...to}]));
        on(network, `${name}::render::stylesheet`, (to: CSSProperties) => _stylesheet(currentStylesheet => ({...currentStylesheet, ...to})));
        on(network, `${name}::get::spring`, () => broadcast(network, `${name}::spring`, spring));
        on(network, `${name}::get::stylesheet`, () => broadcast(network, `${name}::stylesheet`, stylesheet));
        if (initSpring) broadcast(network, `${name}::render::spring`, initSpring);
        if (initStylesheet) broadcast(network, `${name}::render::stylesheet`, initStylesheet);
    }, []);

    return (<animated.div style={{...useSpring({from: spring[0], to: spring[1]}), ...stylesheet}}>{children}</animated.div>)
}