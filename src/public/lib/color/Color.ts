import { Ok } from "@lib/Result";
import { Err } from "@lib/Result";
import { EmptyOk } from "@lib/Result";

export interface ColorType {
    toString() : string;
    toHex() : Hex;
    toRgb() : Rgb;
    toRgba() : Rgba;
}

export type HexCharSetCheckResult
    =
    | Ok<void>
    | HexCharSetCheckErr;

export type HexCharSetCheckErr 
    = 
    | Err<"invalidCharSet">;

export type HexConstructorResult
    =
    | Ok<Hex>
    | HexConstructorErr;

export type HexConstructorErr 
    =
    | HexCharSetCheckErr
    | Err<"stringLengthTooShort">
    | Err<"stringLengthTooLong">
    | Err<"stringMissingHash">;

export interface Hex extends ColorType {}

export function Hex(_string: string) : HexConstructorResult {
    const _VALID_CHARS: Readonly<string[]> = [
        "0", "1", "2", "3", "4", 
        "5", "6", "7", "8", "9", 
        "a", "b", "c", "d", "e", 
        "f", "A", "B", "C", "D", 
        "E", "F"
    ];
    function _checkCharSet(string: string) : HexCharSetCheckResult {
        for (let i = 1; i < string.length; i++) {
            let char: string = string[i];
            let hasValidChar: boolean = false;
            for (let x = 0; x < _VALID_CHARS.length; x++) {
                let validChar: string = _VALID_CHARS[x];
                if (char === validChar) hasValidChar = true;
            }
            if (!hasValidChar) return Err<"invalidCharSet">("invalidCharSet");
        }
        return EmptyOk;
    }
    if (_string.length < 7) return Err<"stringLengthTooShort">("stringLengthTooShort");
    if (_string.length > 7) return Err<"stringLengthTooLong">("stringLengthTooLong");
    if (_string.startsWith("#") === false) return Err<"stringMissingHash">("stringMissingHash");
    let charSetCheck: HexCharSetCheckResult = _checkCharSet(_string);
    if (charSetCheck.err) return charSetCheck;
    return Ok<Hex>({ toString, toHex, toRgb, toRgba });
    function toString(): string {
        return _string;
    }
    function toHex() : Hex {
        /// cannot fail because initial state is checked at construction and is immutable
        return Hex(_string).unwrap();
    }
    function toRgb() : Rgb {
        let value : string = _string.slice(1);
        let r : bigint = BigInt(parseInt(value.slice(0, 2), 16));
        let g : bigint = BigInt(parseInt(value.slice(2, 4), 16));
        let b : bigint = BigInt(parseInt(value.slice(4, 6), 16));
        /// cannot fail because initial state is checked at construction and is immutable
        return Rgb(r, g, b).unwrap();
    }
    function toRgba() : Rgba {
        /// cannot fail because initial state is checked at construction and is immutable
        return Rgba(toRgb(), 1).unwrap();
    }
}

export type RgbConstructorResult
    =
    | Ok<Rgb>
    | RgbConstructorErr;

export type RgbConstructorErr
    =
    | Err<"valueRIsBelowMinRgbValue">
    | Err<"valueGIsBelowMinRgbValue">
    | Err<"valueBIsBelowMinRgbValue">
    | Err<"valueRIsAboveMaxRgbValue">
    | Err<"valueGIsAboveMaxRgbValue">
    | Err<"valueBIsAboveMaxRgbValue">;

export interface Rgb extends ColorType {
    r(): bigint;
    g(): bigint;
    b(): bigint;
}

export function Rgb(_r: bigint, _g: bigint, _b: bigint): RgbConstructorResult {
    const _MIN_RGB_VALUE: bigint = 0n;
    const _MAX_RGB_VALUE: bigint = 255n;
    if (_r < _MIN_RGB_VALUE) return Err<"valueRIsBelowMinRgbValue">("valueRIsBelowMinRgbValue");
    if (_g < _MIN_RGB_VALUE) return Err<"valueGIsBelowMinRgbValue">("valueGIsBelowMinRgbValue");
    if (_b < _MIN_RGB_VALUE) return Err<"valueBIsBelowMinRgbValue">("valueBIsBelowMinRgbValue");
    if (_r > _MAX_RGB_VALUE) return Err<"valueRIsAboveMaxRgbValue">("valueRIsAboveMaxRgbValue");
    if (_g > _MAX_RGB_VALUE) return Err<"valueGIsAboveMaxRgbValue">("valueGIsAboveMaxRgbValue");
    if (_b > _MAX_RGB_VALUE) return Err<"valueBIsAboveMaxRgbValue">("valueBIsAboveMaxRgbValue");
    return Ok<Rgb>({ r, g, b, toString, toHex, toRgb, toRgba });
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
        return `rgb(${r()}, ${g()}, ${b()})`;
    }
    function toHex(): Hex {
        let hex0: string = r().toString(16);
        let hex1: string = g().toString(16);
        let hex2: string = b().toString(16);
        hex0 = hex0.length === 1 ? "0" + hex0 : hex0;
        hex1 = hex1.length === 1 ? "0" + hex1 : hex1;
        hex2 = hex2.length === 1 ? "0" + hex2 : hex2;
        let hex: HexConstructorResult = Hex(`${hex0}${hex1}${hex2}`);
        /// cannot fail because initial state is checked at construction and is immutable
        return hex.unwrap();
    }
    function toRgb(): Rgb {
        /// cannot fail because initial state is checked at construction and is immutable
        return Rgb(r(), g(), b()).unwrap();
    }
    function toRgba(): Rgba {
        /// cannot fail because initial state is checked at construction and is immutable
        return Rgba(toRgb(), 1).unwrap();
    }
}

export type RgbaConstructorResult
    =
    | Ok<Rgba>
    | RgbaConstructorErr;

export type RgbaConstructorErr
    =
    | Err<"valueAIsBelowMinOpacityValue">
    | Err<"valueAIsAboveMaxOpacityValue">;

export interface Rgba extends Rgb {
    a(): number;
}

export function Rgba(_rgb: Rgb, _a: number): RgbaConstructorResult {
    const _MIN_OPACITY_VALUE: number = 0;
    const _MAX_OPACITY_VALUE: number = 1;
    if (_a < _MIN_OPACITY_VALUE) return Err<"valueAIsBelowMinOpacityValue">("valueAIsBelowMinOpacityValue");
    if (_a > _MAX_OPACITY_VALUE) return Err<"valueAIsAboveMaxOpacityValue">("valueAIsAboveMaxOpacityValue");
    return Ok<Rgba>({ r, g, b, a, toString, toHex, toRgb, toRgba });
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
        return `rgba(${r()}, ${g()}, ${b()}, ${a()})`;
    }
    function toHex(): Hex {
        let hex0: string = r().toString(16);
        let hex1: string = g().toString(16);
        let hex2: string = b().toString(16);
        hex0 = hex0.length === 1 ? "0" + hex0 : hex0;
        hex1 = hex1.length === 1 ? "0" + hex1 : hex1;
        hex2 = hex2.length === 1 ? "0" + hex2 : hex2;
        let hex: HexConstructorResult = Hex(`${hex0}${hex1}${hex2}`);
        /// cannot fail because initial state is checked at construction and is immutable
        return hex.unwrap();
    }
    function toRgb(): Rgb {
        /// cannot fail because initial state is checked at construction and is immutable
        return _rgb.toRgb();
    }
    function toRgba(): Rgba {
        /// cannot fail because initial state is checked at construction and is immutable
        return Rgba(toRgb(), a()).unwrap();
    }
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