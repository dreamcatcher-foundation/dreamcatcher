import { }

interface IVaultFacet {
    function deposit(FixedPointValue assetsIn) external returns (FixedPointValue amountOut);
    function withdraw(FixedPointValue amountIn) external returns (FixedPointValue assetsOut);
}