import Path from "./app/library/os/path/Path.ts";
import Url from "./app/library/web/Url.ts";
import App from "./app/library/react/App.ts";
import FolderRoute from "./app/library/react/FolderRoute.ts";

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