import {createRoot} from "react-dom/client";
export function render(children: JSX.Element | (JSX.Element)[] | undefined): void {
  createRoot(document.getElementById("root")!).render(children);
}