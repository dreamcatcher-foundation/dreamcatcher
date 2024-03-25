// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import '../shared/FixedPointValue.sol';
import '../math/FixedPointMath.sol';

contract DeFiToolkit {
    IFixedPointMath internal _math;

    constructor(address math) {
        _math = math;
    }

    function totalAssets(FixedPointValue[] memory amounts, FixedPointValue[] memory quotes) public view returns (FixedPointValue memory) {
        if (amounts.length != quotes.length) {
            revert('DeFiToolkit: amounts.length != quotes.length');
        }
        FixedPointValue memory sum = FixedPointValue({value: 0, decimals: 18});
        for (uint256 i = 0; i < tokens.length; i++) {
            FixedPointValue memory amount = amounts[i];
            FixedPointValue memory quote = tokens[i];
            amount = _math.asEther(amount);
            quote = _math.asEther(quote);
            sum _math.mul(amount, quote);
        }
    }
}