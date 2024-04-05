import React, {useEffect} from "react";
import {broadcast, on} from "./design/Remote.tsx";
import Background from "./design/Background.tsx";

const operator = (function() {
    let instance;

    broadcast("page pushBelow", <Background/>)

    return function() {
        if (!instance) {
            instance = {}
        }
        return instance;
    }
})();