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
  borderImage,
  backgroundImage,
  children
}: {
  name: string | number,
  internalNetwork: EventEmitter,
  initialSpring?: object | undefined,
  initialStylesheet?: CSSProperties | undefined,
  width: string,
  height: string,
  borderImage?: string,
  backgroundImage?: string,
  children?: JSX.Element | (JSX.Element)[] | undefined
}): JSX.Element | (JSX.Element)[] {
  useEffect(function() {
    broadcast(internalNetwork, `${name}::render::spring`, {
      width: width,
      height: height,
      borderWidth: "1px",
      borderStyle: "solid",
    });
    broadcast(internalNetwork, `${name}::render::stylesheet`, {
      borderImage: borderImage ?? "linear-gradient(to top, #474647, transparent)",
      backgroundImage: backgroundImage ?? "#171718"
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