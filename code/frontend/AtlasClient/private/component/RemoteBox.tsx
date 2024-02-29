import {EventEmitter} from "fbemitter";
import {useEffect, type CSSProperties} from "react";
import {broadcast} from "../library/EventsNetwork.ts";
import {RemoteRender} from "./RemoteRender.tsx";
export function RemoteSoftObsidianBox({
  name,
  internalNetwork,
  initialSpring,
  initialStylesheet,
  width,
  height,
  background,
  children
}: {
  name: string | number,
  internalNetwork: EventEmitter,
  initialSpring?: object | undefined,
  initialStylesheet?: CSSProperties | undefined,
  width: string,
  height: string,
  background: string,
  children?: JSX.Element | (JSX.Element)[] | undefined
}): JSX.Element | (JSX.Element)[] {
  useEffect(function() {
    broadcast(internalNetwork, `${name}::render::spring`, {
      width: width,
      height: height,
      background: background
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