import {
  createRoot
} from "react-dom/client";
const root = createRoot(document.getElementById('root')!);
const StaticGenericColumn = ({
  width,
  height,
  children
}: {
  width?: string,
  height?: string,
  children: React.ReactNode
}): React.JSX.Element => {
  width ?? "auto";
  height ?? "auto";
  return (
    <div style={{
      width: width,
      height: height,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
    {children}
    </div>
  );
}
const StaticGenericRow = ({
  width,
  height,
  children
}: {
  width?: string,
  height?: string,
  children: React.ReactNode
}): React.JSX.Element => {
  width ?? "auto";
  height ?? "auto";
  return (
    <div style={{
      width: width,
      height: height,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    }}>
    {children}
    </div>
  );
}
const Home = () => {
  
}

import { List } from "./component/static_generic/list.tsx";

const main = () => {
  return (
    <List items={[
      "Bob",
      "Goe"
    ]} render={
      (item: string) => <span style={{
        color: "#990099"
      }}>{item}</span>
    }/>);
}

root.render(main());