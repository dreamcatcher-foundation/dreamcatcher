// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IOwnableToken } from "./OwnableToken.sol";

contract OwnableTokenController {
    IOwnableToken immutable internal _TOKEN;

    constructor(address ownableToken) {
        _TOKEN = IOwnableToken(ownableToken);
        if (_TOKEN.decimals() != 18) {
            revert("OwnableTokenController: ownable token decimals must be 18");
        }
    }

    function _totalSupply() internal view returns (uint256) {
        return _TOKEN.totalSupply();
    }

    function _mint(address account, uint256 amount) internal {
        _TOKEN.mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        _TOKEN.burn(account, amount);
    }
}