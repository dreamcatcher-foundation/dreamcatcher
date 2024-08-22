import type { SessionConstructorErr } from "@lib/Account.tsx";
import { Row } from "@component/Row";
import { Text } from "src/public/component_/text/Text";
import { Ok } from "@lib/Result";
import { RelativeUnit } from "@lib/RelativeUnit";
import { Ref } from "@lib/Ref";
import { config } from "react-spring";
import { useSpring } from "react-spring";
import { connect } from "@lib/Account.tsx"
import { postNotification } from "src/public/component_/state/Notifications";
import * as ColorPalette from "src/public/component_/config/ColorPalette";
import React from "react";

let _isConnecting: Ref<boolean> = Ref<boolean>(false);

export function NavConnectButton(): React.JSX.Element {
    let [symbolSpring, setSymbolSpring] = useSpring(() => ({ opacity: "0", config: config.gentle }));
    let fontSize: string = RelativeUnit(1.5);
    let symbolColor: string = ColorPalette.DEEP_PURPLE.toString();
    let shadowSize: number = 1;
    let shadowSize0: number = shadowSize * 1;
    let shadowSize1: number = shadowSize * 2;
    let shadowSize2: number = shadowSize * 3;
    let shadowSize3: number = shadowSize * 4;
    let shadowSize4: number = shadowSize * 5;
    let shadowSize5: number = shadowSize * 6;
    let distance0: string = RelativeUnit(shadowSize0);
    let distance1: string = RelativeUnit(shadowSize1);
    let distance2: string = RelativeUnit(shadowSize2);
    let distance3: string = RelativeUnit(shadowSize3);
    let distance4: string = RelativeUnit(shadowSize4);
    let distance5: string = RelativeUnit(shadowSize5);
    let shadow0: string = `0 0 ${ distance0 } ${ symbolColor }`;
    let shadow1: string = `0 0 ${ distance1 } ${ symbolColor }`;
    let shadow2: string = `0 0 ${ distance2 } ${ symbolColor }`;
    let shadow3: string = `0 0 ${ distance3 } ${ symbolColor }`;
    let shadow4: string = `0 0 ${ distance4 } ${ symbolColor }`;
    let shadow5: string = `0 0 ${ distance5 } ${ symbolColor }`;
    let textShadow: string = `${ shadow0 }, ${ shadow1 }, ${ shadow2 }, ${ shadow3 }, ${ shadow4 }, ${ shadow5 }`;
    return <>
        <Row
        style={{
            pointerEvents: "auto",
            cursor: "pointer",
            width: "auto",
            height: "auto",
            gap: RelativeUnit(1)
        }}
        onMouseEnter={() => setSymbolSpring.start({ opacity: "1" })}
        onMouseLeave={() => setSymbolSpring.start({ opacity: "0" })}
        onClick={async () => {
            if (_isConnecting.get()) return;
            _isConnecting.set(true);
            let connection:
                | Ok<void>
                | SessionConstructorErr 
                = await connect();
            if (connection.err) {
                let notification: string = "";
                let e: unknown = connection.val;
                if (typeof e === "string") {
                    switch (e) {
                        case "missingWindow": 
                            notification = "Unable to connect to your account because you are not on a browser."; 
                            break;
                        case "missingProvider": 
                            notification = "Unable to connect to your account because a provider was not found."; 
                            break;
                        case "missingAccounts": 
                            notification = "Unable to connect to your account because your have no accounts"; 
                            break;
                        default: 
                            notification = "Something went wrong while trying to connct to your account.";
                            break;
                    }
                }
                else {
                    notification = "Something went wrong while trying to connct to your account.";
                }
                _isConnecting.set(false);
                return postNotification(notification);
            }
            _isConnecting.set(false);
            return postNotification("You are connected.");
        }}>
            <Text
            text="𖧶"
            style={{
                fontSize: fontSize,
                fontWeight: "bold",
                fontFamily: "satoshiRegular",
                color: symbolColor,
                textShadow: textShadow,
                ... symbolSpring
            }}/>
            <Text
            text="Connect"
            style={{
                fontSize: fontSize
            }}/>
        </Row>
    </>;
}