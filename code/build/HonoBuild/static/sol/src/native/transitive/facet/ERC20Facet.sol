// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import './ERC20Implementation.sol';
import './Facet.sol';

interface IERC20Facet is IFacet {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function increaseAllowance(address spender, uint256 amount) external returns (bool);
    function decreaseAllowance(address spender, uint256 amount) external returns (bool); 
}

contract ERC20Facet is IERC20Facet, ERC20Implementation {
    function selectors() external pure virtual override returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](11);
        selectors[0] = bytes4(keccak256("name()"));
        selectors[1] = bytes4(keccak256("symbol()"));
        selectors[2] = bytes4(keccak256("decimals()"));
        selectors[3] = bytes4(keccak256("totalSupply()"));
        selectors[4] = bytes4(keccak256("balanceOf(address)"));
        selectors[5] = bytes4(keccak256("allowance(address,address)"));
        selectors[6] = bytes4(keccak256("transfer(address,uint256)"));
        selectors[7] = bytes4(keccak256("transferFrom(address,address,uint256)"));
        selectors[8] = bytes4(keccak256("approve(address,uint256)"));
        selectors[9] = bytes4(keccak256("increaseAllowance(address,uint256)"));
        selectors[10] = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        return selectors;
    }

    function name() external view virtual returns (string memory) {
        return _erc20Implementation__name();
    }

    function symbol() external view virtual returns (string memory) {
        return _erc20Implementation__symbol();
    }

    function decimals() external view virtual returns (uint8) {
        return _erc20Implementation__decimals();
    }

    function totalSupply() external view virtual returns (uint256) {
        return _erc20Implementation__totalSupply();
    }

    function balanceOf(address account) external view virtual returns (uint256) {
        return _erc20Implementation__balanceOf(account);
    }

    function allowance(address owner, address spender) external view virtual returns (uint256) {
        return _erc20Implementation__allowance(owner, spender);
    }

    function transfer(address to, uint256 amount) external virtual returns (bool) {
        return _erc20Implementation__transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) external virtual returns (bool) {
        return _erc20Implementation__transferFrom(from, to, amount);
    }

    function approve(address spender, uint256 amount) external virtual returns (bool) {
        return _erc20Implementation__approve(spender, amount);
    }

    function increaseAllowance(address spender, uint256 amount) external virtual returns (bool) {
        return _erc20Implementation__increaseAllowance(spender, amount);
    }

    function decreaseAllowance(address spender, uint256 amount) external virtual returns (bool) {
        return _erc20Implementation__decreaseAllowance(spender, amount);
    }
}