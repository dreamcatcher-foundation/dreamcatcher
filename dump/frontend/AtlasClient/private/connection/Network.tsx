import {EventEmitter} from "fbemitter";

export const network = (function() {
    let instance: EventEmitter;

    return function() {
        if (!instance) instance = new EventEmitter();
        return instance;
    }
})();