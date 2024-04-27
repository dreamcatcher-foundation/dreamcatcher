import Path from "../../module/velvet-v3.0.0/os/path/Path.ts";
import TsxPath from "../../module/velvet-v3.0.0/os/path/TsxPath.ts";
import HtmlPath from "../../module/velvet-v3.0.0/os/path/HtmlPath.ts";
import Url from "../../module/velvet-v3.0.0/web/url/Url.ts";
import Server from "../../module/velvet-v3.0.0/web/Server.ts";
import ReactRoute from "../../module/velvet-v3.0.0/react/ReactRoute.ts";

new ReactRoute(
    new TsxPath(__dirname).join("app/Home.tsx"),
    new HtmlPath(__dirname).join("app/Home.html"),
    new Url("/"));

Server
    .setRootDir(new Path(__dirname).join("app/"))
    .boot(3000n);