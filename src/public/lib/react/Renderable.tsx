import type { RouteObject } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

export function render(routes: RouteObject[]): void {
    let root: null | HTMLElement = document.getElementById("root");
    if (root) {
        return createRoot(root).render(<RouterProvider router={createBrowserRouter(routes)}/>);
    }
    return;
}

export type { RouteObject };