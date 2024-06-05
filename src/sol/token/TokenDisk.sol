// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { ITokenDisk } from "./ITokenDisk.sol";

contract TokenDisk is ITokenDisk {
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;
    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256)) _allowances;

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function allowance(address account, address spender) public view returns (uint256) {
        return _allowances[account][spender];
    }

    function setName(string memory name) public onlyImplementation() returns (string memory oldName, string memory newName) {
        oldName = _name;
        newName = name;
        emit NameChange(oldName, newName);
        return (oldName, newName);
    }

    function setSymbol(string memory symbol) public onlyImplementation() returns (string memory oldSymbol, string memory newSymbol) {
        string memory oldSymbol = symbol();
        string memory newSymbol = _symbol = symbol;
        emit SymbolChange(oldSymbol, newSymbol);
        return (oldSymbol, newSymbol);
    }

    function setTotalSupply(uint256 totalSupply) public onlyImplementation() returns (uint256 oldTotalSupply, uint256 newTotalSupply) {
        uint256 oldTotalSupply = totalSupply();
        uint256 newTotalSupply = _totalSupply = totalSupply;
        _totalSupply = totalSupply;
        return true;
    }
}