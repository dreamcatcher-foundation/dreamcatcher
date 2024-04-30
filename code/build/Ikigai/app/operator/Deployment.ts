import {on} from "./Emitter.ts";

const deployment = (function() {
    let instance;
    let _name: string = "";
    let _tokenName: string = "";
    let _tokenSymbol: string = "";
    const _quirks: [] = [];

    (function() {
        on({
            socket: "WelcomeSettingsInput0",
            message: "Input",
            handler: setName
        });

        on({
            socket: "WelcomeSettingsInput1",
            message: "Input",
            handler: setTokenName
        });

        on({
            socket: "WelcomeSettingsInput2",
            message: "Input",
            handler: setTokenSymbol
        });
    }());

    function name() {
        return _name;
    }

    function tokenName() {
        return _tokenName;
    }

    function tokenSymbol() {
        return _tokenSymbol;
    }

    function quirks() {
        return _quirks;
    }

    function ok() {
        const hasName: boolean = name() !== "";
        const hasTokenName: boolean = tokenName() !== "";
        const hasTokenSymbol: boolean = tokenSymbol() !== "";
        return hasName && hasTokenName && hasTokenSymbol;
    }

    function setName(name: unknown) {
        if (typeof name === "string") _name = name;
        return;
    }

    function setTokenName(tokenName: unknown) {
        if (typeof tokenName === "string") _tokenName = tokenName;
        return;
    }

    function setTokenSymbol(tokenSymbol: unknown) {
        if (typeof tokenSymbol === "string") _tokenSymbol = tokenSymbol;
        return;
    }

    function addQuirk(quirk: unknown) {
        _quirks.push(quirk);
        return;
    }

    function removeQuirk(quirk: unknown) {
        
    }
})();