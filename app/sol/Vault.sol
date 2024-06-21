// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { OwnableTokenController } from "./OwnableTokenController.sol";
import { RebalanceEngine } from "./RebalanceEngine.sol";

interface IVault {
    function previewMint(uint256 assetsIn) external view returns (uint256);
    function previewBurn(uint256 supplyIn) external view returns (uint256);
    function mint(uint256 assetsIn) external returns (bool);
    function burn(uint256 supplyIn) external returns (bool);
}

contract Vault is Ownable, OwnableTokenController, RebalanceEngine {
    address constant internal _DENOMINATION = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    struct Slot {
        address token;
    }

    constructor(address ownableToken) OwnableTokenController(ownableToken) {}

    function totalAssets() public view returns (uint256) {

    }    
}