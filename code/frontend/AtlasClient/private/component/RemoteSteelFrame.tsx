import {EventEmitter} from "fbemitter";
import {useEffect, type CSSProperties} from "react";
import {broadcast} from "../library/EventsNetwork.ts";
import {RemoteRender} from "./RemoteRender.tsx";
export function RemoteSteelFrame({
  name,
  internalNetwork,
  initialSpring,
  initialStylesheet,
  width,
  height,
  borderImage,
  children
}: {
  name: string | number,
  internalNetwork: EventEmitter,
  initialSpring?: object | undefined,
  initialStylesheet?: CSSProperties | undefined,
  width: string,
  height: string,
  borderImage?: string,
  children?: JSX.Element | (JSX.Element)[] | undefined
}): JSX.Element | (JSX.Element)[] {
  useEffect(function() {
    broadcast(internalNetwork, `${name}::render::spring`, {
      width: width,
      height: height,
      borderWidth: "1px",
      borderStyle: "solid"
    });
    broadcast(internalNetwork, `${name}::render::stylesheet`, {
      borderImage: borderImage ?? "linear-gradient(to bottom, #505050, transparent)"
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