// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IVToken } from "./IVToken.sol";

abstract contract VTokenController {
    IVToken private _vToken;

    constructor(address vToken) {
        _vToken = IVToken(vToken);
        require(_vToken.decimals() == 18, "VOID_TOKEN");
    }

    function totalSupply() public view returns (uint256) {
        return _vToken.totalSupply();
    }

    modifier mintable(uint256 amount) {
        _;
        _mint(amount);
    }

    function _mint(uint256 amount) internal {
        _vToken.mint(msg.sender, amount);
    }

    modifier burnable(uint256 amount) {
        _burn(amount);
        _;
    }

    function _burn(uint256 amount) internal {
        _vToken.burn(msg.sender, amount);
    }
}