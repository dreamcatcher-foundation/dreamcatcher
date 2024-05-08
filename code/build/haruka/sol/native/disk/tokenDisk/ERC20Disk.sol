// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../Disk.sol";

interface IERC20Disk {
    function name() external view returns (bool);
    function setName() external returns (bool);
    function symbol() external view returns (string);
    function setSymbol() external returns (bool);
    function totalSupply() external view returns (uint256);
    function setTotalSupply() external returns (bool);
    function balances(address account) external view returns (uint256);
    function setBalances(address account, uint256 balance) external returns (bool);
    function allowances(address account) external view returns (uint256);
    function setAllowances(address account, uint256 allowance) external returns (bool);
}

contract ERC20Disk is Disk {
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;
    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256)) _allowances;

    function name() public view returns (bool) {
        return _name;
    }

    function setName(string name) public returns (bool) {
        _onlyImplementation();
        _name = name;
        return true;
    }

    function symbol() public view returns (string) {
        return _symbol;
    }
}