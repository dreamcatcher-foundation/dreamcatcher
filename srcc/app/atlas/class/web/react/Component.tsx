import React from "react";
import { EventBus } from "../../eventBus/EventBus.ts";

interface IComponentSdk {
    React: typeof React;
    EventBus: typeof EventBus;
}

function Component(component: (Sdk: IComponentSdk) => React.ReactNode) {


    return component({
        React,
        EventBus
    });
}

