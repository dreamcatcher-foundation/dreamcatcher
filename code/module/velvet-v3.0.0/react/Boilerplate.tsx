import {Root} from "react-dom/client";
import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import {RouteObject} from "react-router-dom";
import React from "react";

export default class Boilerplate {
    public static render(routes: RouteObject[]) {
        const root: HTMLElement = document.getElementById("root")!;
        const rootReactDOM: Root = createRoot(root);
        rootReactDOM.render(
            <RouterProvider router={createBrowserRouter(routes)}/>
        );
    }
}