export function userHasMetamaskInstalled(): boolean {
    const windowAsAny = window as any;
    const metamask: any = windowAsAny.ethereum;
    if (!metamask) {
        return false;
    }
    return true;
}

export function userHasLightModeEnabled(): boolean {
    let windowAsAny: any = window as any;
    if (windowAsAny.matchMedia) {
        if (!windowAsAny.matchMedia(`(prefers-color-schema: dark)`).matches) {
            return true;
        }
        return false;
    }
    else {
        return false;
    }
}

export function userHasDarkModeEnabled(): boolean {
    return !userHasLightModeEnabled();
}

