import {on} from "./Emitter.ts";

function bootErrorNode() {
    on()
        .useSocket("Address")
        .useMessage("MissingKey")
        .useHandler((instance) => console.log("Address: missing key", instance));
