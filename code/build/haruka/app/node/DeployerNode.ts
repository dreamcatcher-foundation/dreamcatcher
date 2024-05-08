import {defaultMappedEventEmitter} from "../library/event-driven-architecture/DefaultMappedEventEmitter.ts";

let DAONameField: string = "";
let DAOTokenNameField: string = "";
let DAOTokenSymbolField: string = "";

function bootDeployerNode() {
    defaultMappedEventEmitter.hookEvent("metadataFormSlide.DAONameField", "INPUT_CHANGE", (input: string) => {DAONameField = input;});
    defaultMappedEventEmitter.hookEvent("metadataFormSlide.DAOTokenNameField", "INPUT_CHANGE", (input: string) => {DAOTokenNameField = input;});
    defaultMappedEventEmitter.hookEvent("metadataFormSlide.DAOTokenSymbolField", "INPUT_CHANGE", (input: string) => {DAOTokenSymbolField = input;});
    defaultMappedEventEmitter.hookEvent("metadataFormSlide.submit", "SUBMIT", function() {
        
    });
}