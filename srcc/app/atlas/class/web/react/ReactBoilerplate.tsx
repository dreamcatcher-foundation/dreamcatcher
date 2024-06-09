import * as ReactDomClient from "react-dom/client";
import * as ReactRouterDom from "react-router-dom";
import React from "react";

export class ReactBoilerplate {
    public static render(routes: ReactRouterDom.RouteObject[]): void {
        let root: HTMLElement = document.getElementById("root")!;
        let rootReactDom: ReactDomClient.Root = ReactDomClient.createRoot(root);
        rootReactDom.render(<ReactRouterDom.RouterProvider router={ReactRouterDom.createBrowserRouter(routes)}/>);
    }
}