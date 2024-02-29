
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\ERC20Shortcut.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/deps/openzeppelin/token/ERC20/ERC20.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/ERC20Burnable.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/ERC20Snapshot.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/ERC20Permit.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol";
////import "contracts/polygon/deps/openzeppelin/token/ERC20/extensions/IERC20Permit.sol";
////import 'contracts/polygon/deps/openzeppelin/token/ERC20/IERC20.sol';

interface IToken is IERC20, IERC20Metadata, IERC20Permit {
    function balanceOfAt(address account, uint snapshotId) external returns (uint);
    function totalSupplyAt(uint snapshotId) external returns (uint);
    
    function burn(uint amount) external;
    function burnFrom(address account, uint amount) external;

    function snapshot() external returns (uint);
}

contract Token is ERC20, ERC20Burnable, ERC20Snapshot, ERC20Permit {
    constructor(string memory name, string memory symbol, uint mint_) ERC20(name, symbol) ERC20Permit(name) {
        _mint(msg.sender, mint_ * (10**18));
    }

    function snapshot() external virtual returns (uint) {
        return _snapshot();
    }

    function _mint(address to, uint amount) internal virtual override {
        super._mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint amount) internal override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }   
}

/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\ERC20Shortcut.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/solidstate/ERC20/Token.sol";

library ERC20Shortcut {

    error ERC20ShortcutInsufficientBalance();
    error ERC20ShortcutFailureToPullAsset();
    error ERC20ShortcutFailureToPushAsset();
    error ERC20ShortcutNonCompliant();

    function isCompliantERC20(address token) internal view returns (bool) {
        
    }

    function name(address token) internal view returns (string memory) {
        IToken tkn = IToken(token);
        return tkn.name();
    }

    function symbol(address token) internal view returns (string memory) {
        IToken tkn = IToken(token);
        return tkn.symbol();
    }

    function decimals(address token) internal view returns (uint8) {
        IToken tkn = IToken(token);
        return tkn.decimals();
    }

    function totalSupply(address token) internal view returns (uint) {
        IToken tkn = IToken(token);
        return tkn.totalSupply();
    }

    function balanceOf(address token, address account) internal view returns (uint) {
        IToken tkn = IToken(token);
        return tkn.balanceOf(account);
    }

    function transfer(address token, address to, uint amount) internal returns (bool) {
        IToken tkn = IToken(token);
        return tkn.transfer(to, amount);
    }

    function allowance(address token, address owner, address spender) internal view returns (uint) {
        IToken tkn = IToken(token);
        return tkn.allowance(owner, spender);
    }

    function approve(address token, address spender, uint amount) internal returns (bool) {
        IToken tkn = IToken(token);
        return tkn.approve(spender, amount);
    }

    function transferFrom(address token, address from, address to, uint amount) internal returns (bool) {
        IToken tkn = IToken(token);
        return tkn.transferFrom(from, to, amount);
    }

    function balance(address token) internal view returns (uint) {
        return balanceOf(token, address(this));
    }

    function requireBalance(address token, uint amount) internal view returns (bool) {
        if (balance(token) < amount) {
            revert ERC20ShortcutInsufficientBalance();
        }
        return true;
    }

    function safePull(address token, uint amount) internal returns (bool) {
        requireBalanceOf(token, amount);
        bool success = pull(token, amount);
        if (!success) {
            revert ERC20ShortcutFailureToPullAsset();
        }
    }

    function pull(address token, uint amount) internal returns (bool) {
        return transferFrom(token, msg.sender, address(this), amount);
    }

    function safePush(address token, address to, uint amount) internal returns (bool) {
        requireBalance(token, amount);
        bool success = push(token, to, amount);
        if (!success) {
            revert ERC20ShortcutFailureToPushAsset();
        }
    }

    function push(address token, address to, uint amount) internal returns (bool) {
        return transfer(token, to, amount);
    }

    function balanceOf(address token) internal view returns (uint) {
        return balanceOf(token, msg.sender);
    }

    function requireBalanceOf(address token, uint amount) internal view returns (bool) {
        if (balanceOf(token) < amount) {
            revert ERC20ShortcutInsufficientBalance();
        }
        return true;
    }
}
