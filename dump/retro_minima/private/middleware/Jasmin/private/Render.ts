import {type Root, createRoot} from "react-dom/client";
export function render({
  children
}: {
  children?: JSX.Element
}): void {
  let root: Root = createRoot(document.getElementById("root")!);
  root.render(children);
}