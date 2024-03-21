interface FixedPointValue {
    value: bigint;
    decimals: bigint;
}

const num0: number = 0.1;
const num1: number = 1;
const myNum0: FixedPointValue = {value: BigInt(num0 * (10**18)), decimals: 18n};
const myNum1: FixedPointValue = {value: BigInt(num1 * (10**18)), decimals: 18n};
const portion: bigint = 5000n;

function mul(fixedPointValue0: FixedPointValue, fixedPointValue1: FixedPointValue) {
    const decimals0 = fixedPointValue0.decimals;
    const decimals1 = fixedPointValue1.decimals;
    if (decimals0 != decimals1)
        throw new Error("decimals mismatch");
    const value0 = fixedPointValue0.value;
    const value1 = fixedPointValue1.value;
    const result = (value0 * value1) / (10n**decimals0);
    return {value: result, decimals: decimals0};
}

function div(fixedPointValue0: FixedPointValue, fixedPointValue1: FixedPointValue) {
    const decimals0 = fixedPointValue0.decimals;
    const decimals1 = fixedPointValue1.decimals;
    if (decimals0 != decimals1)
        throw new Error("decimals mismatch");
    const value0 = fixedPointValue0.value;
    const value1 = fixedPointValue1.value;
    const result = (value0 * (10n**decimals0)) / value1;
    return {value: result, decimals: decimals0};
}

/// check that if we multiply this by the rep 18 version of 10_000 or 100
/// we couldnt need to do the last 10**18 mul.
function scale(fixedPointValue0: FixedPointValue, fixedPointValue1: FixedPointValue) {
    const decimals0 = fixedPointValue0.decimals;
    const decimals1 = fixedPointValue1.decimals;
    if (decimals0 != decimals1)
        throw new Error("decimals mismatch");
    const result0 = div(fixedPointValue0, fixedPointValue1);
    const result1 = mul(result0, {value: 10_000n * (10n**18n), decimals: 18n});
    return {value: result1.value, decimals: 18n};
}

function slice(fixedPointValue: FixedPointValue, portion: bigint) {
    const decimals = fixedPointValue.decimals;
    const result0 = div(fixedPointValue, {value: 10_000n, decimals: 18n});
    const result1 = mul(result0, {value: portion, decimals: 18n});
    return {value: result1.value, decimals: decimals};
}

console.log(num0 * num1, Number(mul(myNum0, myNum1).value) / (10**18));
console.log(num0 / num1, Number(div(myNum0, myNum1).value) / (10**18));
console.log((num0 / num1) * 10_000, Number(scale(myNum0, myNum1).value) / (10**18));
console.log((num0 / 10_000) * Number(portion), Number(slice(myNum0, portion).value) / (10**18));