// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { IUniswapV2Factory } from "../../non-native/uniswap/interfaces/IUniswapV2Factory.sol";
import { IUniswapV2Router02 } from "../../non-native/uniswap/interfaces/IUniswapV2Router02.sol";

struct _V2OracleStoragePointer {
    IUniswapV2Factory _factory;
    IUniswapV2Router02 _router;
}

contract V2OracleStoragePointer {
    bytes32 constant internal _slV2Oracle = bytes32(uint256(keccak256("eip1967.slV2Oracle")) - 1);

    function _v2Oracle() internal pure returns (_V2OracleStoragePointer storage sl) {
        bytes32 loc = _slV2Oracle;
        assembly {
            sl.slot := loc
        }
    }

    function _factory() internal view returns (IUniswapV2Factory) {
        return _v2Oracle()._factory;
    }

    function _router() internal view returns (IUniswapV2Router02) {
        return _v2Oracle()._router;
    }

    function _setFactory(address factory) internal {
        _v2Oracle()._factory = IUniswapV2Factory(factory);
        return;
    }

    function _setRouter(address router) internal {
        _v2Oracle()._router = IUniswapV2Router02(router);
        return;
    }
}