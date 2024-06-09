import type {Root} from "react-dom/client";
import type {RouteObject} from "react-router-dom";
import {RouterProvider} from "react-router-dom";
import {createRoot} from "react-dom/client";
import {createBrowserRouter} from "react-router-dom";
import React from "react";

class ReactBoilerplate {
    public static render(routes: RouteObject[]) {
        const root: HTMLElement = document.getElementById("root")!;
        const rootReactDOM: Root = createRoot(root);
        rootReactDOM.render(
            <RouterProvider {...{
                router: createBrowserRouter(routes)
            }}>
            </RouterProvider>
        )
    }
}

export {ReactBoilerplate};