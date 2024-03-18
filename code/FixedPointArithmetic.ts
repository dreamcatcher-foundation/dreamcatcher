
// maximum 'uint256' number
const maxUint256: bigint = 115792089237316000000000000000000000000000000000000000000000000000000000000000n;

function ether(number: number) {
    let numberEther = number * (10**18);
    let numberBigIntEther = BigInt(numberEther);
    return numberBigIntEther;
}


// -> Proportion of a in b as BP.
function basisOfNumber0InNumber1(number0: bigint, number1: bigint): bigint {
    return (number0 * scale_()) / number1;
}

// weights must sum up to a maximum of 'scale_'
function weightedAverassge(numbers: bigint[], weights: bigint[]): bigint {
    let vals_: bigint[] = [];
    for (let i_ = 0; i_ < numbers.length; i_++) {
        let number_ = numbers[i_];
        let weight_ = weights[i_];
        vals_[i_] = number_ * weight_;
    }
    return sum(vals_);
}

function change(n0: bigint, n1: bigint) {
    return ((n1 - n0) / n0) * 10000n;
}

console.log(
    change(ether(23.28), ether(32.4))
)


function sum(numbers: bigint[]) {
    let result_: bigint = 0n;
    for (let i_ = 0; i_ < numbers.length; i_++) {
        let number_ = numbers[i_];
        result_ += number_;
    }
    return result_;
}



function scale_(): bigint {
    return 10000n;
}

function decimals_(): bigint {
    return 18n;
}