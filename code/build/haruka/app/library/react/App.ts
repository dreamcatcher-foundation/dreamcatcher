import FolderRoute from "./FolderRoute.ts";
import Server from "../web/Server.ts";
import Path from "../os/path/Path.ts";

export default class App {
    public constructor(routes: FolderRoute[], rootPathish: string | Path, port?: bigint) {
        routes;
        Server
            .setRootDirectory(rootPathish)
            .boot(port);
    }
}