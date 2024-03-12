// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import '../../non-native/uniswap/interfaces/IUniswapV2Factory.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Router02.sol';
import '../../non-native/uniswap/interfaces/IUniswapV2Pair.sol';
import '../../non-native/openzeppelin/token/ERC20/extensions/IERC20Metadata.sol';
import '../../non-native/openzeppelin/token/ERC20/IERC20.sol';
import '../../non-native/openzeppelin/utils/math/Math.sol';
import '../../non-native/openzeppelin/token/ERC20/extensions/ERC4626.sol';
import '../../non-native/openzeppelin/Ownable.sol';
import '../util/FinanceMathLibrary.sol';
import '../util/ConversionMathLibrary.sol';

contract QuickswapVault is ERC4626, Ownable {
    using Math for uint256;
    using ConversionMathLibrary for uint256;
    using FinanceMathLibrary for FinanceMathLibrary.Payload;

    struct Hidden {
        address[] holdings;
    }

    Hidden private hidden;

    constructor(IERC20 asset, string memory tokenName, string memory tokenSymbol) 
        IERC4626(asset) 
        IERC20(tokenName, tokenSymbol) 
        Ownable(msg.sender) {}

    /**
    * NOTE Total assets is the value that would be received if all
    *      assets were to be withdrawn at the same moment.
     */
    function totalAssets() public view virtual override returns (uint256) {
        FinanceMathLibrary.Payload payload;
        payload.tokens = hidden.holdings;
        payload.asset = asset();
        payload.uniswapV2Factory = 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32;
        payload.uniswapV2Router02 = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
        uint256 assetsIfSwappedDirectlyAtThisMomentAsEtherValue = payload.assetsFromDirectSwaps(payload.netAssetValueWithoutAssetBalance());
        uint256 assetsIfSwappedDirectlyAtThisMoment.fromEtherToNonNativeDecimals(IERC20Metadata(asset()).decimals());
        uint256 assetsAlreadyHeld = IERC20(asset()).balanceOf(address(this));
        return assetsIfSwappedDirectlyAtThisMoment + assetsAlreadyHeld;
    }

    /**
    * NOTE Is overriden because before withdrawal the owed amoutns of
    *      tokens are swapped for assets and then sent back to the
    *      owner. This amount may be higher that the totalAsse
     */
    function withdraw(uint256 assets, address receiver, address owner) public virtual override returns (uint256) {
        require(assets <= maxWithdraw(owner), 'QuickswapVault: withdraw more than max');
        uint256 shares = previewWithdraw(assets);
        uint256 assetsOwed = previewRedeem(shares);
        FinanceMathLibrary.Payload payload;
        payload.tokens = hidden.holdings;
        payload.asset = asset();
        payload.uniswapV2Factory = 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32;
        payload.uniswapV2Router02 = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
        uint256 balanceOwed = payload.directlySwapForAssets(assetsOwed);
        _withdraw(_msgSender(), receiver, owner, balanceOwed, shares);
        return shares;
    }

    function redeem(uint256 shares, address receiver, address owner) public virtual returns (uint256) {

    }
}