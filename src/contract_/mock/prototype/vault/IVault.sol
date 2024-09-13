// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { Quote } from "./Quote.sol";

interface IVault {
    event Mint(address account);
    event Burn(address account);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function secondsLeftToNextRebalance() external view returns (uint256);
    function previewMint(uint256 assetsIn) external view returns (uint256);
    function previewBurn(uint256 supplyIn) external view returns (uint256);
    function quote() external view returns (Quote memory);
    function totalAssets() external view returns (Quote memory);
    function totalSupply() external view returns (uint256);
    function rebalance() external;
    function mint() external;
    function burn() external;
}