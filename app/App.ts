import { server } from "./class/host/Server.ts";
import { Url } from "./class/web/Url.ts";
import { message } from "./class/eventBus/EventBus.ts";
import { event } from "./class/eventBus/EventBus.ts";
import { MessageSubscription } from "./class/eventBus/EventBus.ts";
import { EventSubscription } from "./class/eventBus/EventBus.ts";



MessageSubscription({
    message: "boot",

    handler({ item }) {
        console.log("Boot");

        (async function() {

        })();

        (async function() {
            server()

                .expose({
                    url: Url({
                        _string: "/supportedChainIds"
                    }),
                    
                    handler(request, response) {
                        
                        response.send([137n]);
                    }
                });

            event({
                from: "Core",
                event: "ServerSetUpCompleted"
            });
        })();
    },
});