import {type HexCharArray} from "./CharSetLib.ts";

export type Hex = string & {
  __brand: "hex"
};

export function Hex({
  hexCharArray
}: {
  hexCharArray: HexCharArray
}): Hex {
  let result: string = "";
  for (let i = 0; i < hexCharArray.length; i++) {
    result += hexCharArray[i];
  }
  return result as Hex;
}