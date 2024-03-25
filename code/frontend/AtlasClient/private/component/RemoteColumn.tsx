import {EventEmitter} from "fbemitter";
import {useEffect, type CSSProperties} from "react";
import {broadcast} from "../library/EventsNetwork.ts";
import {RemoteRender} from "./RemoteRender.tsx";
export function RemoteColumn({
  name,
  internalNetwork,
  initialSpring,
  initialStylesheet,
  width,
  height,
  children
}: {
  name: string
    | number,
  internalNetwork: EventEmitter,
  initialSpring?: object
    | undefined,
  initialStylesheet?: CSSProperties
    | undefined,
  width: string,
  height: string,
  children?: JSX.Element
    | (JSX.Element)[]
    | undefined
}): JSX.Element | (JSX.Element)[] {
  useEffect(function() {
    broadcast(internalNetwork, `${name}::render::spring`, {
      width: width,
      height: height
    });
    broadcast(internalNetwork, `${name}::render::stylesheet`, {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    });
  }, []);
  return (
    <RemoteRender
      name={name}
      internalNetwork={internalNetwork}
      initialSpring={initialSpring}
      initialStylesheet={initialStylesheet}>
      {children}
    </RemoteRender>
  );
}