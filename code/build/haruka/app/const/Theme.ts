


function hasMetamaskInstalled(): boolean {
    
}



function isLightMode(): boolean {
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




export enum ThemeMode {
    IsDark,
    isLight
}

export type Theme = ReturnType<typeof Theme>;

export function Theme(
    mode: ThemeMode = ThemeMode.IsDark,
    darkModeContainerColor0: string,
    darkModeContainerColor1: string,
    darkModeContainerColor2: string,
    darkModeTextColor: string,
    darkModeHighlightColor: string,
    darkModeSuccessColor: string,
    darkModeFailureColor: string,
    darkModeWarningColor: string,
    lightModeContainerColor0: string,
    lightModeContainerColor1: string,
    lightModeContainerColor2: string,
    lightModeTextColor: string,
    lightModeHighlightColor: string,
    lightModeSuccessColor: string,
    lightModeFailureColor: string,
    lightModeWarningColor: string) {
    
    return {
        mode,
        darkModeContainerColor0,
        darkModeContainerColor1,
        darkModeContainerColor2,
        darkModeTextColor,
        darkModeHighlightColor,
        darkModeSuccessColor,
        darkModeFailureColor,
        darkModeWarningColor,
        lightModeContainerColor0,
        lightModeContainerColor1,
        lightModeContainerColor2,
        lightModeTextColor,
        lightModeHighlightColor,
        lightModeSuccessColor,
        lightModeFailureColor,
        lightModeWarningColor
    }
}


function Color(_darkModeColor: string, _lightModeColor: string) {
    
    function get(): string {
        let windowAsAny: any = window as any;
        if (windowAsAny.matchMedia) {
            if (windowAsAny.matchMedia(`(prefers-color-schema: dark)`).matches) {
                return _darkModeColor;
            }
            else {
                return _lightModeColor;
            }
        }
        else {
            return _darkModeColor;
        }
    }

    return {get};
}

const color = Color("", "");