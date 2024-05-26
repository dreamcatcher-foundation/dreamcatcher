import { type Root } from "react-dom/client";
import { type RouteObject } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import React from "react";

class ReactBoilerplate {
    public static render(routes: RouteObject[]): void {
        let root: HTMLElement = document.getElementById("root")!;
        let rootReactDom: Root = createRoot(root);
        rootReactDom.render(
            <RouterProvider
            router={createBrowserRouter(routes)}>
            </RouterProvider>
        );
    }
}

export { ReactBoilerplate };