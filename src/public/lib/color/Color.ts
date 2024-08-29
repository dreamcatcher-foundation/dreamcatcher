import { require } from "@lib/ErrorHandler";

export type ColorErrorCode
    =
    | "hex-void-string-length"
    | "hex-void-string"
    | "hex-void-char-set"
    | "rgb-value-is-below-min"
    | "rgb-value-is-above-max"
    | "rgba-alpha-is-below-min-bounds"
    | "rgba-alpha-is-above-max-bounds";

export type ColorType 
    ={
        toString(): string;
        toHex(): Hex;
        toRgb(): Rgb;
        toRgba(): Rgba;
    };

export type Hex
    =
    & ColorType
    & {};

export function Hex(_string: string): Hex {
    let _charSet: string[] = [
        "0", "1", "2", "3", "4", 
        "5", "6", "7", "8", "9", 
        "a", "b", "c", "d", "e", 
        "f", "A", "B", "C", "D", 
        "E", "F"
    ];
    
    _check(_string, _charSet);
    
    function toString(): string {
        return _string;
    }

    function toHex(): Hex {
        return Hex(toString());
    }

    function toRgb(): Rgb {
        let x: string = toString().slice(1);
        let r: bigint = BigInt(parseInt(x.slice(0, 2), 16));
        let g: bigint = BigInt(parseInt(x.slice(2, 4), 16));
        let b: bigint = BigInt(parseInt(x.slice(4, 6), 16));
        return Rgb(r, g, b);
    }

    function toRgba(): Rgba {
        return Rgba(toRgb(), 1);
    }

    function _check(string: string, charSet: string[]): void {
        require<ColorErrorCode>(string.length === 7, "hex-void-string-length");
        require<ColorErrorCode>(string.startsWith("#"), "hex-void-string");
        _checkCharSet(string, charSet);
    }

    function _checkCharSet(string: string, charSet: string[]): void {
        for (let i = 1; i < string.length; i += 1) _checkChar(string[i], charSet);
        return;
    }

    function _checkChar(char: string, charSet: string[]): void {
        for (let i = 0; i < charSet.length; i += 1) if (char === charSet[i]) return;
        return require<ColorErrorCode>(false, "hex-void-char-set", char);
    }

    return { toString, toHex, toRgb, toRgba };
}

export type Rgb
    =
    & ColorType
    & {
        r(): bigint;
        g(): bigint;
        b(): bigint;
    };

export function Rgb(_r: bigint, _g: bigint, _b: bigint): Rgb {
    let _min: bigint = 0n;
    let _max: bigint = 255n;
    _check(_r, _min, _max);
    _check(_g, _min, _max);
    _check(_b, _min, _max);

    function r(): bigint {
        return _r;
    }

    function g(): bigint {
        return _g;
    }

    function b(): bigint {
        return _b;
    }

    function toString(): string {
        let x0: string = String(Number(r()));
        let x1: string = String(Number(g()));
        let x2: string = String(Number(b()));
        return "rgb" + "(" + x0 + "," + x1 + "," + x2 + ")";
    }

    function toHex(): Hex {
        let x0: string = r().toString(16);
        let x1: string = g().toString(16);
        let x2: string = b().toString(16);
        let y0: string = x0.length === 1 ? "0" + x0 : x0;
        let y1: string = x1.length === 1 ? "0" + x1 : x1;
        let y2: string = x2.length === 1 ? "0" + x2 : x2;
        let string: string = y0 + y1 + y2;
        return Hex(string);
    }

    function toRgb(): Rgb {
        return Rgb(r(), g(), b());
    }

    function toRgba(): Rgba {
        return Rgba(toRgb(), 1);
    }

    function _check(x: bigint, min: bigint, max: bigint): void {
        _checkMin(x, min);
        _checkMax(x, max);
        return;
    }

    function _checkMin(x: bigint, min: bigint): void {
        return require<ColorErrorCode>(x >= min, "rgb-value-is-below-min");
    }

    function _checkMax(x: bigint, max: bigint): void {
        return require<ColorErrorCode>(x <= max, "rgb-value-is-above-max");
    }

    return { r, g, b, toString, toHex, toRgb, toRgba };
}

export type Rgba
    =
    & Rgb
    & {
        a(): number;
    };

export function Rgba(_rgb: Rgb, _a: number): Rgba {
    _checkAlpha(_a);

    function r(): bigint {
        return _rgb.r();
    }

    function g(): bigint {
        return _rgb.g();
    }

    function b(): bigint {
        return _rgb.b();
    }

    function a(): number {
        return _a;
    }

    function toString(): string {
        let x0: string = String(Number(r()));
        let x1: string = String(Number(g()));
        let x2: string = String(Number(b()));
        return "rgba" + "(" + x0 + "," + x1 + "," + x2 + ")";
    }

    function toHex(): Hex {
        let x0: string = r().toString(16);
        let x1: string = g().toString(16);
        let x2: string = b().toString(16);
        let y0: string = x0.length === 1 ? "0" + x0 : x0;
        let y1: string = x1.length === 1 ? "0" + x1 : x1;
        let y2: string = x2.length === 1 ? "0" + x2 : x2;
        let string: string = y0 + y1 + y2;
        return Hex(string);
    }

    function toRgb(): Rgb {
        return Rgb(r(), g(), b());
    }

    function toRgba(): Rgba {
        return Rgba(toRgb(), 1);
    }

    function _checkAlpha(x: number): void {
        _checkMinAlpha(x);
        _checkMaxAlpha(x);
    }

    function _checkMinAlpha(x: number): void {
        return require<ColorErrorCode>(x >= 0, "rgba-alpha-is-below-min-bounds");
    }

    function _checkMaxAlpha(x: number): void {
        return require<ColorErrorCode>(x <= 1, "rgba-alpha-is-above-max-bounds");
    }

    return { r, g, b, a, toString, toHex, toRgb, toRgba };
}

export type ColorLike =
    | Hex
    | Rgb
    | Rgba;

export function isHex(colorLike: ColorLike): colorLike is Hex {
    return !isRgb(colorLike) && !isRgba(colorLike);
}

export function isRgb(colorLike: ColorLike): colorLike is Rgb {
    return (
        "r" in colorLike 
        && "g" in colorLike 
        && "b" in colorLike
        && typeof colorLike.r === "bigint"
        && typeof colorLike.g === "bigint"
        && typeof colorLike.b === "bigint"
    );
}

export function isRgba(colorLike: ColorLike): colorLike is Rgba {
    return (
        isRgb(colorLike)
        && "a" in colorLike
        && typeof colorLike.a === "number"
    );
}