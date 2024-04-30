import {
    Server,
    Path,
    TypescriptPath,
    HyperTextMarkupLanguagePath,
    Url,
    ReactRoute
} from "../../module/toolkit/Toolkit.ts";

new ReactRoute(
    new TypescriptPath(
        new Path(__dirname)
            .join("app/Home.tsx")),
    new HyperTextMarkupLanguagePath(
        new Path(__dirname)
            .join("app/Home.html")),
    new Url("/")
);

Server
    .setRootDir(new Path(__dirname)
        .join("app/"))
    .boot(3000n);