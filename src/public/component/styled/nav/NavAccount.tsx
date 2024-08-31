export type {ReactNode} from "react";
import type {ClientErrorCode} from "@component/Client";
import {FlexRow} from "@component/FlexRow";
import {FlexCol} from "@component/FlexCol";
import {Sprite} from "@component/Sprite";
import {Typography} from "@component/Typography";
import {Erc20Interface} from "@component/Erc20Interface";
import {createMachine as Machine} from "xstate";
import {useSpring} from "react-spring";
import {useMachine} from "@xstate/react";
import {useMemo} from "react";
import {useState} from "react";
import {connect} from "@component/Client";
import {accountAddress} from "@component/Client";
import {accountChainId} from "@component/Client";
import {ifEthersError} from "@lib/EthersErrorParser";
import {ifFault} from "@lib/ErrorHandler";
import * as ColorPalette from "@component/ColorPalette";

export function NavAccount() {
    let [address, setAddress] = useState<string>("");
    let [chainId, setChainId] = useState<bigint>(0n);
    let [_, setNavAccount] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgCMB7CgFwGJYBXTTOWAbQAYBdRUABwqxc1XBXy8QAD0QAmGQFYSAThkAOAIzqAzADZd8mVtUAaEAE9E21SS1aOMjlqUcdAdgAs71aoC+P02hYeISklDS0AGbouAA2DABOYJw8SCACQiJiEtIIcooqGtp6OgZGpha57lok7uquOkpOHPU6qjp+ARg4BMQkmFQxEBQA7vi0Q4TJEunCouKpOTLuSjbyOoZuRjI6y1rllo02up7q7jqaSvJK7f4ggd0hJLgQMWC0DHwQ6NRJ3NOCsyyC1kWncJFUSkhkLq8ma6ja+wQ3hISwh8lOOnsrjk7j8t3wFAgcAk92CxH+GTm2UQAFodIi6R07l0yaEqNQKYD5qAcu4ZIjnCjsRxVM0OBx5PVcbdST1SP0KIMRty0gDMiqcqDrPJ3C51OjdK5sSZzJY2iR4epDHzGmoljImbLHs9Xpz1dSEFqSDq9Qa3MbERoSBxGh5Q20ZOp1nifEA */
        initial: "boot",
        states: {
            boot: {
                entry: () => {
                    return (async () => {
                        try {
                            setAddress(await accountAddress());
                            setChainId(await accountChainId());
                            setNavAccount({type: "success"});
                            return;
                        }
                        catch (e: unknown) {
                            setNavAccount({type: "failure"});
                        }
                    })();
                },
                on: {
                    success: "idle",
                    failure: "cooldown"
                }
            },
            cooldown: {
                entry: () => {
                    setTimeout(() => setNavAccount({type: "done"}), 1000);
                    return;
                },
                on: {
                    done: "boot"
                }
            },
            idle: {
                entry: () => {
                    setInterval(() => setNavAccount({type: "update"}), 1000);
                    return;
                },
                on: {
                    update: "boot"
                }
            }
        }
    }), [
        setAddress,
        setChainId
    ]));
    return <>
        <FlexRow
        style={{
        gap: "10px"
        }}>
            <Typography
            content={(() => {
                if (address === "") return "Account: 0x000"
                let char0: string = address[0];
                let char1: string = address[1];
                let char2: string = address[2];
                let char3: string = address[3];
                let char4: string = address[4];
                return `Account: ${char0}${char1}${char2}${char3}${char4}`;
            })()}
            style={{
            fontSize: "0.75em"
            }}/>

            <Typography
            content={`Network: ${String(Number(chainId))}`}
            style={{
            fontSize: "0.75em"
            }}/>
        </FlexRow>
    </>;
}