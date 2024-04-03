import React, {useEffect} from "react";
import Remote, {broadcast, on, off, once} from "./design/Remote.tsx";
import Background from "./design/Background.tsx";
import Layer from "./design/Layer.tsx";
import RemoteCol from "./design/RemoteCol.tsx";
import RemoteRow from "./design/RemoteRow.tsx";
import PurpleTextHeading from "./design/PurpleTextHeading.tsx";
import Window from "./design/Window.tsx";
import SteelTextSubHeading from "./design/SteelTextSubHeading.tsx";
import RemoteButton1 from "./design/RemoteButton1.tsx";
import RemoteButton2 from "./design/RemoteButton2.tsx";
import Row from "./design/Row.tsx";

enum WindowState {
    NONE,
    IDLE,
    COLLECTING_DEPLOYMENT_DATA,
    DEPLOYING,
    INSTALLATION,
    YOU_ARE_ALL_SET_TO_GO
}

const browser = (function() {
    let instance: {
        save: typeof save;
        load: typeof load;
    };

    function save(k: string, v: string) {
        return localStorage.setItem(k, v);
    }

    function load(k: string) {
        return localStorage.getItem(k);
    }

    return function() {
        if (!instance) {
            instance = {
                save,
                load
            };
        }
        return instance;
    }
})();

const animation = (function() {
    let animationInstance: {
        intro: typeof intro;
        outro: typeof outro;
    };

    function intro() {
        return "swing-in-top-fwd";
    }

    function outro() {
        return "swing-out-top-bck";
    }

    return function() {
        if (!animationInstance) animationInstance = {
            intro,
            outro
        };
        return animationInstance;
    }
})();


interface IState {
    from: Function;
    to: Function;
}

interface IStateMachine {
    goto: (state: unknown) => any;
}

const window = (function() {
    let instance: {
        goto: typeof goto;
    };

    async function goto(to: WindowState) {
        const from = await _loadState();
        switch (to) {
            case WindowState.IDLE:
                _onDone(_toIdle);
                _saveState(WindowState.IDLE);
                break;
            case WindowState.COLLECTING_DEPLOYMENT_DATA:
                _onDone(_toCollectingDeploymentData);
                _saveState(WindowState.COLLECTING_DEPLOYMENT_DATA);
            break;
        }
        switch (from) {
            case WindowState.NONE:
                _done();
                break;
            case WindowState.IDLE:
                _fromIdle();
                break;
            default:
                _done();
                break;
        }
    }

    async function _fromIdle() {
        execute("window", [
            function() {
                off("getStartedButton clicked");
                off("learnMoreButton clicked");
                broadcast("header setClassName", animation().outro());
            },
            function() {
                broadcast("subHeader setClassName", animation().outro());
            },
            function() {
                broadcast("getStartedButton setClassName", animation().outro());
            },
            function() {
                broadcast("learnMoreButton setClassName", animation().outro());
            },
            function() {
                broadcast("window wipe");
            }
        ], 100n);
    }

    async function _toIdle() {
        function randomSubHeading() {
            const subHeadings = [
                "You won't need accountants where we are going",
                "Do your client's trust you? They shouldn't have to",
                "Finance is broken, help us fix it",
                "68% of fund managers hate paying expensive operation costs",
                "Web3 is much more than meme coins and monkey pics ... or is it?",
                "Please leave us feedback : ) it helps us a lot",
                "You look familiar, have we seen you here before?",
                "It's time to empower the little guy",
                "Access global liquidity in seconds",
                "Rug proof",
                "Our community drives us",
                "Hate VC? We do too, that's why we are 100% public",
                "How can you trust your money is safe? Open-source!",
                "Let us, help you, change the world.",
                "Entepreneurs wanted!"
            ];
            const subHeadingsLength = subHeadings.length;
            const randomSubHeadingIndex = Math.floor(Math.random() * subHeadingsLength);
            const randomSubHeading = subHeadings[randomSubHeadingIndex];
            return randomSubHeading;
        }

        execute("window", [
            function() {
                broadcast("window pushBelow",
                    <Remote name={"header"} initialClassName={animation().intro()}>
                        <PurpleTextHeading text={"Scaling Dreams, Crafting Possibilities"} style={{}}/>
                    </Remote>
                );
            },
            function() {
                broadcast("window pushBelow",
                    <Remote name={"subHeader"} initialClassName={animation().intro()} initStyle={{marginTop: "10px"}}>
                        <SteelTextSubHeading text={randomSubHeading()} style={{fontSize: "15px"}}/>
                    </Remote>
                );
            },
            function() {
                broadcast("window pushBelow", 
                    <Row width={"100%"} height={"150px"}/>
                );
            },
            function() {
                broadcast("window pushBelow",
                    <RemoteRow name={"buttonsSection"} width={"100%"} height={"auto"} initStyle={{gap: "20px"}}/>
                );
            },
            function() {
                broadcast("buttonsSection pushBelow", 
                    <RemoteButton1 name={"getStartedButton"} text={"Get Started"} initialClassName={animation().intro()}/>
                );
            },
            function() {
                broadcast("buttonsSection pushBelow", 
                    <RemoteButton2 name={"learnMoreButton"} text={"Learn More"} initialClassName={animation().intro()}/>
                );
            },
            function() {
                on("getStartedButton clicked", function() {
                    window().goto(WindowState.COLLECTING_DEPLOYMENT_DATA);
                });
                on("learnMoreButton clicked", function() {
                    const url = "https://dreamcatcher-1.gitbook.io/dreamcatcher/";
                    (window as any)?.open(url);
                });
            }
        ], 100n);
    }

    async function _toCollectingDeploymentData() {
        execute("window", [
            function() {
                broadcast("window pushBelow",
                    <Remote name={"collectingDeploymentDataHeader"} initialClassName={animation().intro()}>
                        <PurpleTextHeading text={"Let's Get Some Details"} style={{}}/>
                    </Remote>
                );
            },
            function() {
                broadcast("window pushBelow",
                    <Remote name={"collectingDeploymentDataDiamondName"}>
                    </Remote>
                );
            }
        ], 100n);
    }

    async function _done() {
        broadcast("window transition done");
    }

    async function _onDone(fn: Function) {
        once("window transition done", fn);
    }

    async function _saveState(state: WindowState) {
        return browser().save("windowState", state.toString());
    }

    async function _loadState() {
        const loadedState = browser().load("windowState");
        const from = Number((loadedState ?? WindowState.NONE));
        return from;
    }

    return function() {
        if (!instance) {
            instance = {
                goto
            };
        }
        return instance;
    }
})();

const page = (function() {
    let instance: {};

    return function() {
        if (!instance) {
            return instance = {};
        }
        return instance;
    }
})();

export const operator = (function() {
    let instance: any;
    let _delay = 50;








    _enterHomePageSubProcess();

    function _enterHomePageSubProcess() {

        _exec(function() {
            broadcast("page pushBelow", <Background/>);
            broadcast("page pushBelow", 
                <Layer zIndex={"2000"}>
                    <RemoteCol name={"layer"} width={"100%"} height={"100%"}/>
                </Layer>
            );
        });
    
        _exec(function() {
            broadcast("layer pushBelow", 
                <Window name={"window"} width={"450px"} height={"450px"}/>
            );
        });

        _exec(() => window().goto(WindowState.IDLE));
    }

    function _exec(fn: Function) {
        setTimeout(fn, _delay);
        _delay += 20;
    }



    return function() {
        if (!instance) {
            instance = {}
        }
        return instance;
    }
})();

async function execute(name: string, fns: Function[], cooldown: bigint) {
    const fnLength = fns.length;
    let wait = 0n;
    for (let i = 0; i < fnLength; i++) {
        const fn = fns[i];
        await new Promise(resolve => {
            setTimeout(function() {
                fn();
                resolve(null);
            }, Number(wait));
        });
        wait += cooldown;
    }
    await new Promise(resolve => {
        setTimeout(function() {
            broadcast(`${name} transition done`);
            resolve(null);
        }, Number(wait));
    });
}