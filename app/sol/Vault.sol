// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import { IERC20 } from "./imports/openzeppelin/token/ERC20/IERC20.sol";
import { IERC20Metadata } from "./imports/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
import { ITokenFactory } from "./Token.sol";
import { IToken } from "./Token.sol";
import { IPairFactory } from "./Pair.sol";
import { IPair } from "./Pair.sol";
import { FixedPointCalculator } from "./FixedPointCalculator.sol";
import { ShareCalculator } from "./ShareCalculator.sol";
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";

struct PairPayload {
    address[] path;
    uint256 targetAllocation;
}

contract Vault is Ownable, FixedPointCalculator, ShareCalculator {
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
            totalAllocation += pairs[i].targetAllocation;
        }
        if (totalAllocation > 100000000000000000000) {
            revert AllocationsExceedOneHundredPercent();
        }
        IPairFactory factory = IPairFactory(pairFactory);
        for (uint256 i = 0; i < pairs.length; i += 1) {
            _checkForDuplicateAsset(pairs[i]);
            _checkForBaseCurrency(pairs[i]);
            address[] memory path = pairs[i].path;
            uint256 targetAllocation = pairs[i].targetAllocation;
            address pair = factory.deploy(path, targetAllocation);
            _pairs.push(IPair(pair));
        }
    }

    function previewMint(uint256 assetsIn) public view returns (uint256) {
        return _amountToMint(assetsIn, totalRealAssets(), _token.totalSupply());
    }

    function previewBurn(uint256 supplyIn) public view returns (uint256) {
        return _amountToSend(supplyIn, totalRealAssets(), _token.totalSupply());
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

    function mint(uint256 assetsIn) public returns (uint256) {
        uint8 decimals0 = IERC20Metadata(_CURRENCY).decimals();
        IERC20(_CURRENCY).transferFrom(msg.sender, address(this), _toNewDecimals(assetsIn, 18, decimals0));
        uint256 amountToMint = previewMint(assetsIn);
        if (amountToMint == 0) {
            revert("Vault: Unable to mint.");
        }
        _token.mint(msg.sender, amountToMint);
        return amountToMint;
    }

    function burn(uint256 supplyIn) public returns (bool) {
        require(supplyIn != 0, "Vault: Supply in cannot be zero.");
        require(previewBurn(supplyIn) != 0, "Vault: Unable to burn");
        _token.burn(msg.sender, supplyIn);
        uint256 slice = _mul(_div(supplyIn, _token.totalSupply(), 18, 18), _oneHundredPercent(), 18, 18);
        for (uint256 i = 0; i < _pairs.length; i += 1) {
            uint8 decimals = IERC20Metadata(_pairs.sellSidePath()[0]).decimals();
            uint256 balance = IERC20(_pairs.sellSidePath()[0]).balanceOf(address(this));
            uint256 balanceConverted = _toEther(balance, decimals);
            uint256 amountToSend = _sliceOf(balanceConverted, slice, 18, 18);
            IERC20(_pairs.sellSidePath()[0]).transfer(msg.sender, _toNewDecimals(amountToSend, 18, decimals));
        }
        return true;
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
        if (totalRealAssets() == 0) {
            return 0;
        }
        if (_allocation(pair) <= pair.targetAllocation()) {
            return 0;
        }
        uint256 targetBalance = _mul(_div(totalRealAssets(), _oneHundredPercent(), 18, 18), pair.targetAllocation(), 18, 18);
        uint256 actualBalance = _mul(_div(totalRealAssets(), _oneHundredPercent(), 18, 18), _allocation(pair), 18, 18);
        return _sub(actualBalance, targetBalance, 18, 18);
    }

    function _deficit(IPair pair) private view returns (uint256) {
        if (totalRealAssets() == 0) {
            return 0;
        }
        if (_allocation(pair) >= pair.targetAllocation()) {
            return 0;
        }
        uint256 targetBalance = _mul(_div(totalRealAssets(), _oneHundredPercent(), 18, 18), pair.targetAllocation(), 18, 18);
        uint256 actualBalance = _mul(_div(totalRealAssets(), _oneHundredPercent(), 18, 18), _allocation(pair), 18, 18);
        return _sub(targetBalance, actualBalance, 18, 18);
    }

    function _allocation(IPair pair) private view returns (uint256) {
        uint256 result = 0;
        result = _div(pair.realAssets(), totalRealAssets(), 18, 18);
        result = _mul(result, _oneHundredPercent(), 18, 18);
        return result;
    }

    function _checkForDuplicateAsset(PairPayload memory pair) private view returns (bool) {
        for (uint256 i = 0; i < _pairs.length; i += 1) {
            if (_pairs[i].sellSidePath()[0] == pair.path[0]) {
                revert DuplicateAsset();
            }
        }
        return true;
    }

    function _checkForBaseCurrency(PairPayload memory pair) private pure returns (bool) {
        if (pair.path[pair.path.length - 1] != _CURRENCY) {
            revert PairsMustHaveTheSameBaseCurrency();
        }
        return true;
    }
}