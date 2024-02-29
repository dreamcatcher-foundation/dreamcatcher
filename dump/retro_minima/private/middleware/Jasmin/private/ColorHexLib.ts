import {type HexChar} from "./CharSetLib.ts";

export type ColorHexCharArray = [
  HexChar,
  HexChar,
  HexChar,
  HexChar,
  HexChar,
  HexChar
];

export type ColorHex = `#${string}` & {
  __brand: "color"
};

export function ColorHexConstructor(...args: ColorHexCharArray) {
  let result: string = "#";
  for (let i = 0; i < args.length; i++) {
    result += args[i];
  }
  return result as ColorHex;
}