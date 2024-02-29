import type {THexChar} from "./CharSetLib.ts";

export type TColorHexChars = [
  THexChar,
  THexChar,
  THexChar,
  THexChar,
  THexChar,
  THexChar
];

export type TColorHex = `#{${string}}` & {
  __brand: "ColorHex";
};

export function ColorHexConstructor({
  code
}: {
  code: TColorHexChars
}): TColorHex {
  let result: string = "#";
  for (let i = 0; i < code.length; i++) {
    result += code[i];
  }
  return result as TColorHex;
}

export function ColorHexPromiseConstructor({
  code
}: {
  code: TColorHexChars
}): Promise<TColorHex> {
  return new Promise(
    function(
      resolve: (
        value: TColorHex
             | PromiseLike<TColorHex>
      ) => void,
      reject: (reason?: any) => void
    ): void {
      try {
        let result: string = "#";
        for (let i = 0;  i < code.length; i++) {
          result += code[i];
        }
        resolve(result as TColorHex);
      } catch (error) {
        reject(error);
      }
    }
  )
}