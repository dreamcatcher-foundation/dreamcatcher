// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;


struct PairConstructorPayload {
    address[] path;
    address router;
    address factory;
    uint256 targetAllocationPercentage;
}

contract Vault {
    

    UniswapV2Pair[] private _pairs;
    IToken private _token;

    constructor(PairConstructorPayload[] pairs) {
        require(pairs.length <= 16, "too many pairs");
        for (uint256 i = 0; i < pair.length; i += 1) {
            _pairs.push(new UniswapV2Pair(
                pairs[i].path,
                pairs[i].router,
                pairs[i].factory,
                pairs[i].targetAllocationPercentage
            ));
        }
    }

    function pairs() {
        return _pairs;
    }


    function totalBestAssets() public view returns (FixedPointValue memory r18) {
        FixedPointValue memory result = FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < pairs().length; i += 1) {
            result = fixedPointMathLibrary().add(result, pairs()[i].bestTotalAssets());
        }
        return result;
    }

    function totalRealAssets() public view returns (FixedPointValue memory r18) {
        FixedPointValue memory result = FixedPointValue({ value: 0, decimals: 18 });
        for (uint256 i = 0; i < pairs().length; i += 1) {
            result = fixedPointMathLibrary().add(result, pairs()[i].realTotalAssets());
        }
        return result;
    }

    function _addPairs(IPair[] pairs) internal {
        _pairs.push(pair);
    }

    function _rebalance() internal returns (bool) {
        for (uint256 i = 0; i < pairs().length; i += 1) {
            
        }
    }
}