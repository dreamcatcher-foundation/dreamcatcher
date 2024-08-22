import type { ReactNode } from "react";
import { Ok } from "@lib/Result";
import { Err } from "@lib/Result";
import { PageTemplate } from "src/public/component_/layout/template/PageTemplate";
import { Image } from "src/public/component_/misc/Image";
import { Text } from "src/public/component_/text/Text";
import { U } from "@lib/RelativeUnit";
import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { createMachine as Machine } from "xstate";
import { useState } from "react";
import * as Account from "@lib/Account.tsx";

export function PagePreConnectTemplate({
    content,
    background
}:{
    content: ReactNode;
    background: ReactNode;
}): ReactNode {
    const connectToYourWeb3WalletLoaderMessage: string = "Connect to your Web3 Wallet.";
    const changeYourNetworkToPolygonLoaderMessage: string = "Change your network to polygon.";
    const somethingWentWrongTryAgainLaterLoaderMessage: string = "Something went wrong. Try again later."
    const [loaderMessage, setLoaderMessage] = useState<string>(connectToYourWeb3WalletLoaderMessage);
    const [content_, setContent] = useState<ReactNode>(() => <></>);
    const [_, setPagePreConnectTemplate] = useMachine(useMemo(() => Machine({
        /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBsB7dCAqAYlgFdNM5YBtABgF1FQAHCrFwAXXBXx8QAD0QAmAIwBWEgE45ADgUAWbcr2cdAGhABPRAs7aSnVQDYNAdkeclDzo4DMcgL4+TaFh4hKSU1LR0AGbouGSMAE5gXLxIIILCYhJSsgiKKupauvqWxmbycnIkSt6eCnKqDbWOTn4BGDgExCQA7jEidBASSTxS6aLikqk5cp6qJJ5ucnaOckpKGtqr2ibmCAorJNpKlnauSppHvq0g+BQQcFKBHSGjQuNZU4gAtHY733bXJ7BLphGj4KCvDITbKITZ-PbOGweWraWxybR2OyqRyA9rA0JUe4QSHvSagHKeTwaKqouxHOxKbQLKzwrQ2VSeRzaDnNOyKPm4oKdUi9UQkzJkmSISnUxmcOluRnM7ZlPYaOwkBRaOQrXScLbaHF+HxAA */
        initial: "loading",
        states: {
            loading: {
                entry: () => {
                    setContent(() =>
                        <>
                            <PagePreConnectTemplateLoader 
                            message={ loaderMessage }/>
                        </>
                    );
                    (async () => {
                        if (Account.isConnected()) {
                            let chainId:
                                | Ok<bigint>
                                | Account.NotConnectedErr
                                | Err<unknown>
                                = await Account.chainId();
                            if (chainId.err) {
                                setLoaderMessage(somethingWentWrongTryAgainLaterLoaderMessage);
                                setPagePreConnectTemplate({ type: "failure "});
                                return;
                            }
                            if (chainId.unwrap() !== 137n) {
                                setLoaderMessage(changeYourNetworkToPolygonLoaderMessage);
                                setPagePreConnectTemplate({ type: "failure" });
                                return;
                            }
                            return setPagePreConnectTemplate({ type: "success" })
                        };
                        let connection:
                            | Ok<void>
                            | Account.SessionConstructorErr
                            = await Account.connect();
                        if (connection.err) {
                            setLoaderMessage(somethingWentWrongTryAgainLaterLoaderMessage);
                            setPagePreConnectTemplate({ type: "failure" });
                            return;
                        }
                        let chainId:
                            | Ok<bigint>
                            | Account.NotConnectedErr
                            | Err<unknown>
                            = await Account.chainId();
                        if (chainId.err) {
                            setLoaderMessage(somethingWentWrongTryAgainLaterLoaderMessage);
                            setPagePreConnectTemplate({ type: "failure "});
                            return;
                        }
                        if (chainId.unwrap() !== 137n) {
                            setLoaderMessage(changeYourNetworkToPolygonLoaderMessage);
                            setPagePreConnectTemplate({ type: "failure" });
                            return;
                        }
                        return setPagePreConnectTemplate({ type: "success" });
                    })();
                    return;
                },
                on: {
                    success: "loaded",
                    failure: "wait"
                }
            },
            loaded: {
                entry: () => {
                    return setContent(content);
                }
            },
            wait: {
                entry: () => {
                    let ms: number = 3600;
                    return setTimeout(() => {
                        return setPagePreConnectTemplate({ type: "done" });
                    }, ms);
                },
                on: {
                    done: "loading"
                }
            }
        }
    }), [setLoaderMessage, setContent]));
    return <>
        <PageTemplate
        content={ content_ }
        background={ background }/>
    </>;
}

export function PagePreConnectTemplateLoader({
    message
}:{
    message: string;
}): ReactNode {
    return <>
        <Image
        src="../../../img/animation/loader/Infinity.svg"
        style={{
            width: U(20),
            aspectRatio: "1/1"
        }}/>
        <Text
        text={ message }
        style={{
            fontSize: U(2.5)
        }}/>
    </>;
}