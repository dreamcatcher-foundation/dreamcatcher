import {defaultMappedEventEmitter} from "../messenger/DefaultMappedEventEmitter.ts";

function bootGateway() {
    let nodeName: string = "gateway";
    defaultMappedEventEmitter.hook(nodeName, "query", function() {
        
    });
}