import type {CSSProperties} from "react";












import {createRoot} from "react-dom/client";

function render({
  children
}: {
  children?: JSX.Element
           | undefined;
}): void {
  createRoot(document.getElementById("root")!)
    .render(children);
}