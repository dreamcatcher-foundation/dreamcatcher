// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IDisk } from "../IDisk.sol";

interface ITokenDisk is IDisk {
    event NameChange(from string, to string);
    event SymbolChange(from string, to string);
    event TotalSupplyChange(from uint256, to uint256);
    event BalanceChange(address account, uint256 from, uint256 to);
    event AllowanceChange(address owner, address spender, uint256 from, uint256 to);

    function name() external view returns (bool);
    function symbol() external view returns (string);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function setName(string memory name) external returns (string memory oldName, string memory newName);
    function setSymbol(string memory symbol) external returns (bool);
    function setTotalSupply(uint256 totalSupply) external returns (bool);
    function setBalanceOf(address account, uint256 balance) external returns (bool);
    function setAllowanceOf(address owner, address spender, uint256 allowance) external returns (bool);   
}