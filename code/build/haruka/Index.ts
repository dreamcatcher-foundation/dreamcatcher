import Path from "./app/lib/os/path/Path.ts";
import Url from "./app/lib/web/Url.ts";
import App from "./app/lib/react/App.ts";
import FolderRoute from "./app/lib/react/FolderRoute.ts";

new App(
    [
        new FolderRoute(
            new Path(__dirname).join("app/"),
            new Url("/")
        )
    ],
    new Path(__dirname).join("app/"),
    3000n
);