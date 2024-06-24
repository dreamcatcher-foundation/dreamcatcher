// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Result, Ok, Err } from "./Result.sol";
import { IVToken } from "./IVToken.sol";
import { VendorLib } from "./VendorLib.sol";

abstract contract VTokenController {
    using VendorLib for uint256;

    event Mint(address indexed account, uint256 amount);
    event Burn(address indexed account, uint256 amount);

    IVToken private _vToken;

    constructor(address vToken) {
        _vToken = IVToken(vToken);
        if (_vToken.decimals() != 18) {
            revert("VOID_TOKEN");
        }
    }
    
    function totalSupply() public view returns (uint256) {
        return _vToken.totalSupply();
    }

    modifier authorizeMint(uint256 assetsIn, uint256 totalAssets, uint256 totalSupply) {
        _;
        (Result r, uint256 x) = assetsIn.previewMint(totalAssets, totalSupply);
        if (!r.ok) {
            r.panic();
        }
        _mint(msg.sender, x);
    }

    modifier authorizeBurn(uint256 supplyIn, uint256 totalAssets, uint256 totalSupply) {
        (Result r, uint256 x) = supplyIn.previewBurn(totalAssets, totalSupply);
        if (!r.ok) {
            r.panic();
        }
        _burn(msg.sender, x);
        _;
    }

    function _mint(address account, uint256 amount) internal {
        _vToken.mint(account, amount);
        emit Mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        _vToken.burn(account, amount);
        emit Burn(account, amount);
    }
}