import {type Root, createRoot} from "react-dom/client";
import {type RouteObject, RouterProvider, createBrowserRouter} from "react-router-dom";

export default class Boilerplate {
    public static render(routes: RouteObject[]) {
        const root: HTMLElement = document.getElementById("root")!;
        const rootReactDOM: Root = createRoot(root);
        rootReactDOM.render(
            <RouterProvider {...{
                router: createBrowserRouter(routes)
            }}>
            </RouterProvider>
        );
    }
}