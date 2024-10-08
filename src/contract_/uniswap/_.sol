// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "./asset/token/IToken.sol";
import {IUniswapV2Router02} from "./import/uniswap/v2/interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "./import/uniswap/v2/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "./import/uniswap/v2/interfaces/IUniswapV2Pair.sol";

contract Vault {




    struct VirtualSafeSimulationInput {
        uint amount;
        uint assets;
        uint supply;
    }

    function _previewMint(VirtualSafeSimulationInput memory state) internal pure returns (uint256) {
        return
            state.amount == 0 ? 0 :

            state.assets == 0 && state.supply == 0 ? _initialMint() :
            state.assets != 0 && state.supply == 0 ? _initialMint() :
            state.assets == 0 && state.supply != 0 ? 0 :

            _div(_mul(state.amount, state.supply), state.assets);
    }

    function _previewBurn(VirtualSafeSimulationInput memory state) internal pure returns (uint256) {
        return
            state.amount == 0 ? 0 :

            state.assets == 0 && state.supply == 0 ? 0 :
            state.assets != 0 && state.supply == 0 ? 0 :
            state.assets == 0 && state.supply != 0 ? 0 :

            _div(_mul(state.amount, state.assets), state.supply);
    }

    function _initialMint() private pure returns (uint256) {
        return 1000000e18;
    }


    function _slc(uint256 x, uint256 percentage) internal pure returns (uint256) {
        return _mul(_div(x, 100e18), percentage);
    }

    function _lss(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return 100e18 - _yld(x, y);
    }

    function _yld(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return 
            x == 0 ? 0 :
            x >= y ? 100e18 : 
            _pct(x, y);
    }

    function _pct(uint256 x, uint256 y) internal pure returns (uint256 percentage) {
        return _mul(_div(x, y), 100e18);
    }

    function _add(uint256 x, uint256 y) internal pure returns (uint256) {
        unchecked {
            uint256 z = x + y;
            if (z < x) revert ("unsigned-integer-overflow");
            return z;
        }
    }

    function _sub(uint256 x, uint256 y) internal pure returns (uint256) {
        unchecked {
            uint256 z = x - y;
            if (y > x) revert ("unsigned-integer-underflow");
            return z;
        }
    }

    function _mul(uint256 x, uint256 y) internal pure returns (uint256) {
        return _muldiv(x, y, 1e18);
    }

    function _div(uint256 x, uint256 y) internal pure returns (uint256) {
        return _muldiv(x, 1e18, y);
    }

    function _toNewPrecision(uint256 x, uint8 decimals0, uint8 decimals1) internal pure returns (uint256) {
        return x == 0 || decimals0 == decimals1 ? x : _muldiv(x, 10**decimals1, 10**decimals0);
    }

    function _muldiv(uint256 x, uint256 y, uint256 z) internal pure returns (uint256) {
        unchecked {
            uint256 prod0;
            uint256 prod1;
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }
            if (prod1 == 0) {
                return prod0 / z;
            }
            if (z <= prod1) revert ("unsigned-integer-muldiv-overflow");
            uint256 remainder;
            assembly {
                remainder := mulmod(x, y, z)
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }
            uint256 twos = z & (~z + 1);
            assembly {
                z := div(z, twos)
                prod0 := div(prod0, twos)
                twos := add(div(sub(0, twos), twos), 1)
            }
            prod0 |= prod1 * twos;
            uint256 inverse = (3 * z) ^ 2;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            inverse *= 2 - z * inverse;
            return prod0 * inverse;
        }
    }
}