export function textShadowGlow(color: string, strength: number): string {
    let strength0: number = strength * 1;
    let strength1: number = strength * 2;
    let strength2: number = strength * 3;
    let strength3: number = strength * 4;
    let strength4: number = strength * 5;
    let strength5: number = strength * 6;
    let distance0: string = _toDistance(strength0);
    let distance1: string = _toDistance(strength1);
    let distance2: string = _toDistance(strength2);
    let distance3: string = _toDistance(strength3);
    let distance4: string = _toDistance(strength4);
    let distance5: string = _toDistance(strength5);
    let shadow0: string = `0 0 ${ distance0 } ${ color }`;
    let shadow1: string = `0 0 ${ distance1 } ${ color }`;
    let shadow2: string = `0 0 ${ distance2 } ${ color }`;
    let shadow3: string = `0 0 ${ distance3 } ${ color }`;
    let shadow4: string = `0 0 ${ distance4 } ${ color }`;
    let shadow5: string = `0 0 ${ distance5 } ${ color }`;
    return `${shadow0}, ${shadow1}, ${shadow2}, ${shadow3}, ${shadow4}, ${shadow5}`;
}

function _toDistance(strength: number): string {
    return `${strength}px`;
}