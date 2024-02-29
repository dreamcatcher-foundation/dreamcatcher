import type {THexChar} from "./CharSetLib.ts";

export type THex = string & {
  __brand: "Hex";
};

export function HexConstructor({
  code
}: {
  code: THexChar[]
}): THex {
  let result: string = "";
  for (let i = 0; i < code.length; i++) {
    result += code[i];
  }
  return result as THex;
}

export function HexPromiseConstructor({
  code
}: {
  code: THexChar[]
}): Promise<THex> {
  return new Promise(
    function(
      resolve: (
        value: THex
             | PromiseLike<THex>
      ) => void,
      reject: (reason?: any) => void
    ): void {
      try {
        let result: string = "";
        for (let i = 0; i < code.length; i++) {
          result += code[i];
        }
        resolve(result as THex);
      } catch (error) {
        reject(error);
      }
    }
  );
}