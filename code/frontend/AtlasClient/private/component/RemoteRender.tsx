/**
 * {name}::render::spring
 * {name}::render::stylesheet
 * {name}::get::spring => {name}::spring
 * {name}::get::stylesheet => {name}::stylesheet
 */
import {EventEmitter} from "fbemitter";
import {type CSSProperties, useEffect, useState} from "react";
import {on, broadcast} from "../library/EventsNetwork.ts";
import {type SpringProps, animated, useSpring} from "react-spring";
export function RemoteRender({
  name,
  internalNetwork,
  initialSpring,
  initialStylesheet,
  children
}: {
  name: string
    | number,
  internalNetwork: EventEmitter,
  initialSpring?: object
    | undefined,
  initialStylesheet?: CSSProperties
    | undefined,
  children?: JSX.Element
    | (JSX.Element)[]
    | undefined
}): JSX.Element | (JSX.Element)[] {
  const [spring, _spring] = useState([{}, {}]);
  const [stylesheet, _stylesheet] = useState({});
  useEffect(function() {
    on(internalNetwork, `${name}::render::spring`, function(target: object): void {
      _spring(currentSpring => [
        currentSpring[1], {
          ...currentSpring[1],
          ...target
        }
      ]);
    });
    on(internalNetwork, `${name}::render::stylesheet`, function(target: CSSProperties) {
      _stylesheet(currentStylesheet => ({
        ...currentStylesheet,
        ...target
      }));
    });
    on(internalNetwork, `${name}::get::spring`, function() {
      broadcast(internalNetwork, `${name}::spring`, spring);
    });
    on(internalNetwork, `${name}::get::stylesheet`, function() {
      broadcast(internalNetwork, `${name}::stylesheet`, stylesheet);
    });
    if (initialSpring) {
      broadcast(internalNetwork, `${name}::render::spring`, initialSpring);
    }
    if (initialStylesheet) {
      broadcast(internalNetwork, `${name}::render::stylesheet`, initialStylesheet);
    }
  }, []);
  return (
    <animated.div
      style={{
        ...useSpring({
          from: spring[0],
          to: spring[1]
        }),
        ...stylesheet
      }}>
      {children}
    </animated.div>
  );
}