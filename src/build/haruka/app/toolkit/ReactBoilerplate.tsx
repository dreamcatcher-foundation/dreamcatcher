import type { Root } from "./Bundle.ts";
import type { RouteObject } from "./Bundle.ts";
import { createRoot } from "./Bundle.ts";
import { RouterProvider } from "./Bundle.ts";
import { createBrowserRouter } from "./Bundle.ts";
import React from "react";

function render(routes: RouteObject[]): void {
    let root: HTMLElement = document.getElementById("root")!;
    let rootReactDom: Root = createRoot(root);
    rootReactDom.render(
        <RouterProvider
        router={createBrowserRouter(routes)}>
        </RouterProvider>
    );
}

export { render };