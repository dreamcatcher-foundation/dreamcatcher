// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {IToken} from "../../../../../solidstate/asset/token/IToken.sol";

struct Sl {
    /// 1.0.0 erc-20
    string name;
    string symbol;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
    uint256 totalSupply;

    /// 1.0.0 asset-management
    Asset[] assets;
    IToken currency;
    
    /// 1.0.0 metadata
    mapping(bytes4 => bool) _supportsInterface;
    
    /// ...
}

struct Asset {
    IToken tokenI;
    IToken currencyI;
    address[] tokenCurrencyPath;
    address[] currencyTokenPath;
    uint256 allocation;
}

abstract contract Storage {
    bytes32 constant internal _$ = bytes32(uint256(keccak256("eip1967.storage")));

    function _sl() internal pure returns (Sl storage sl) {
        bytes32 location = _$;
        assembly {
            sl.slot := location
        }
    }

    function x() internal {
        
    }
}