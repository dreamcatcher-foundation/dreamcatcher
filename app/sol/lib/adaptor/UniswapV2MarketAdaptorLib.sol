
import { UniswapV2Market } from "./UniswapV2Market.sol";
import { UniswapV2Path } from "./UniswapV2Path.sol";

library {
    using UniswapV2Path for address[];

    function pairAddressOf(UniswapV2Market memory market, address[] memory path) internal view returns (address) {
        path.onlyValidPath();
        return IUniswapV2Factory(market.factory).getPair(path.token0(), path.token1());
    }
}