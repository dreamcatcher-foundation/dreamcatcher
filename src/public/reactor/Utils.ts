

export type U = string & { __type: "unit" };

export function U(number: number): U {
    return `${ number }vw` as U;
}

export function pixelsToU(pixels: number): U {
    pixels /= window.innerWidth;
    pixels *= 100;
    return U(pixels);
}