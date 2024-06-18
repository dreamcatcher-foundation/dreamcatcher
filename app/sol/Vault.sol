// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import { ITokenFactory } from "./Token.sol";
import { IToken } from "./Token.sol";
import { IPairFactory } from "./Pair.sol";
import { IPair } from "./Pair.sol";
import { FixedPointCalculator } from "./FixedPointCalculator.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";

struct PairPayload {
    address[] path;
    uint256 targetAllocation;
}

contract Vault is Ownable, FixedPointCalculator {
    error DuplicateAsset();
    error PairsMustHaveTheSameBaseCurrency();
    error AllocationsExceedOneHundredPercent();

    address constant private _CURRENCY = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    IToken private _token;
    IPair[] private _pairs;

    constructor(address tokenFactory, address pairFactory, string memory name, string memory symbol, PairPayload[] memory pairs) Ownable(msg.sender) {
        _token = IToken(ITokenFactory(tokenFactory).deploy(name, symbol));
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < pairs.length; i += 1) {
            totalAllocation += pairs[i].targetAllocation
        }
        if (totalAllocation > 100000000000000000000) {
            revert AllocationsExceedOneHundredPercent();
        }
        for (uint256 i = 0; i < pairs.length; i += 1) {
            if (pairs[i].path[pairs[i].path.length - 1] != _CURRENCY) {
                revert PairsMustHaveTheSameBaseCurrency();
            }
            for (uint256 ii = 0; ii < _pairs.length; ii += 1) {
                if (_pairs[ii].sellSidePath()[0] == pairs[i].path[0]) {
                    revert DuplicateAsset();
                }
            }
            _pairs.push(IPairFactory(pairFactory).deploy(
                pairs[i].path,
                pairs[i].targetAllocation
            ));
        }
    }

    function totalBestAssets() public view returns (uint256) {
        uint256 result = 0;
        for (uint256 i = 0; i < _pairs.length; i += 1) {
            result += _pairs[i].bestAssets();
        }
        return result;
    }

    function totalRealAssets() public view returns (uint256) {
        uint256 result = 0;
        for (uint256 i = 0; i < _pairs.length; i += 1) {
            result += _pairs[i].realAssets();
        }
        return result;
    }

    function rebalance() public onlyOwner() returns (bool) {
        return _rebalance();
    }

    function _rebalance() internal returns (bool) {
        /** Process excess first to raise currency for purchases. */
        for (uint256 i = 0; i < _pairs.length; i += 1) {
            if (_excess(_pairs[i]) != 0) {
                /** Pair will not make the sale if the yield is less than 90% or 10% slippage. */
                try _pairs[i].sell(_excess(_pairs[i])) returns (uint256) {
                    /** ... */
                }
                catch {
                    /** ... */
                }
            }
        }
        for (uint256 i = 0; i < _pairs.length; i += 1) {
            if (_deficit(_pairs[i]) != 0) {
                try _pairs[i].buy(_deficit(_pairs[i])) returns (uint256) {
                    /** ... */
                }
                catch {
                    /** ... */
                }
            }
        }
        return true;
    }

    function _excess(IPair pair) private view returns (uint256) {
        if (_allocation() <= pair.targetAllocation()) {
            return 0;
        }
        uint256 targetBalance = _mul(_div(totalRealAssets(), _oneHundredPercent()), pair.targetAllocation());
        uint256 actualBalance = _mul(_div(totalRealAssets(), _oneHundredPercent()), _allocation(pair));
        return _sub(actualBalance, targetBalance);
    }

    function _deficit(IPair pair) private view returns (uint256) {
        if (_allocation() >= pair.targetAllocation()) {
            return 0;
        }
        uint256 targetBalance = _mul(_div(totalRealAssets(), _oneHundredPercent()), pair.targetAllocation());
        uint256 actualBalance = _mul(_div(totalRealAssets(), _oneHundredPercent()), _allocation(pair));
        return _sub(targetBalance, actualBalance);
    }

    function _allocation(IPair pair) private view returns (uint256) {
        uint256 result = 0;
        result = _div(pair.realAssets(), totalRealAssets());
        result = _mul(result, _oneHundredPercent());
        return result;
    }
}