
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\PoolB.sol
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
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\PoolB.sol
*/
            
////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/solidstate/ERC20/Token.sol";
////import "contracts/polygon/deps/openzeppelin/access/Ownable.sol";

interface IPoolToken is IToken {
    function mint(address to, uint amount) external;

    function owner() external view returns (address);

    function renounceOwnership() external;
    function transferOwnership(address newOwner) external;
}

contract PoolToken is Token, Ownable {
    constructor(string memory name, string memory symbol, uint mint_) Token(name, symbol, mint_) Ownable(msg.sender) {}

    function mint(address to, uint amount) onlyOwner external virtual {
        _mint(to, amount);
    }
}

/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\PoolB.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/libraries/Finance.sol";
////import "contracts/polygon/solidstate/ERC20/PoolToken.sol";
////import "contracts/polygon/solidstate/ERC20/Token.sol";

library Pool {
    using Finance for uint;

    /// compute total assets
    function computeTotalAssets(address[] memory assets, uint[] memory amounts, uint[] memory prices) internal pure returns (uint) {
        require(assets.length != 0, "Length is zero");
        require(amounts.length != 0, "Length is zero");
        require(prices.length != 0, "Length is zero");
        require(assets.length == amounts.length, "Unequal");
        require(amounts.length == prices.length, "Unequal");
        require(prices.length == assets.length, "Unequal");
        uint sum;
        for (uint i = 0; i < assets.length; i++) {
            sum += computeValue(amounts[i], prices[i]);
        }
        return sum;
    }

    /// compute value of an asset with an amount in 10**18 and price as 10**18
    function computeValue(uint amount, uint price) internal pure returns (uint) {
        if (amount == 0 || price == 0) { return 0; }
        return amount * price;
    }

    /// compute portion of an asset to return based on shares burnt
    function computePayable(address shares, uint amountIn, address asset) internal pure returns (uint) {
        require(shares != address(0), "Address is zero");
        require(amountIn != 0, "Value is zero");
        require(tokenOut != address(0), "Address is zero");
        IPoolToken sharesInterface = IPoolToken(shares);
        IToken assetInterface = IToken(asset);
        /// assume shares are as 10**18
        uint supply = sharesInterface.totalSupply();
        require(supply != 0, "Value is zero");
        /// determine % ownership of the balance in the vault
        uint ownership = (amountIn * 10000) / supply;
        /// convert balance from asset native decimals to 10**18
        uint balance = assetInterface.balanceOf(address(this));
        balance = balance.computeAsStandardValue(assetInterface.decimals());
        return (balance * ownership) / 10000;
    }

    
}
