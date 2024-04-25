import * as doka from "./Doka/Shell.ts";
import {join} from "path";

const _$hub = doka.EventHub<{
    "BootCompletion": []
}>();

doka.useAsServerRootDir(join(__dirname, "/static/app"));
doka.exposeFile("/", join(__dirname, "/static/app/App.html"));
_$hub.post("BootCompletion");
doka.bootServer(3000n);