// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IUniswapV2Router02 } from "./imports/uniswap/interfaces/IUniswapV2Router02.sol";
import { IUniswapV2Factory } from "./imports/uniswap/interfaces/IUniswapV2Factory.sol";
import { UniswapV2Pair as UniswapV2PairStruct } from "./libraries/uniswap/UniswapV2Pair.sol";
import { UniswapV2PairLibrary } from "./libraries/uniswap/UniswapV2PairLibrary.sol";
import { FixedPointValue } from "./librariess/fixedPoint/FixedPointValue.sol";
import { FixedPointLibrary } from "./libraries/fixedPoint/FixedPointLibrary.sol":
import { Ownable } from "./imports/openzeppelin/access/Ownable.sol";

contract UniswapV2Pair is Ownable {
    using UniswapV2PairLibrary for UniswapV2PairStruct;
    using FixedPointLibrary for FixedPointValue;

    address[] private _path;
    IUniswapV2Router02 private _router;
    IUniswapV2Factory private _factory;
    FixedPointValue private _targetAllocation;
    
    constructor(address[] memory path, address router, address factory, uint256 targetAllocationPercentage) 
        Ownable(msg.sender) {
        
        for (uint256 i = 0; i < path.length; i += 1) {
            _path.push(path[i]);
        }
        _router = IUniswapV2Router02(router);
        _factory = IUniswapV2Factory(factory);
        _targetAllocation = targetAllocation.convertToEtherDecimals();
    }

    function vault() public view returns (address) {
        return _vault;
    }

    function path() public view returns (address[] memory) {
        address[] memory result = address[](_path.length);
        for (uint256 i = 0; i < _path.length; i += 1) {
            result[i] = _path[i];
        }
        return result;
    }

    function router() public view returns (IUniswapV2Router02) {
        return _router;
    }

    function factory() public view returns (IUniswapV2Factory) {
        return _factory;
    }

    function targetAllocation() public view returns (FixedPointValue memory percentageAsEther) {
        return _targetAllocatedPercentage;
    }

    function allocation(FixedPointValue memory totalAssets) {
        return actualAssetValue().div(IVault(owner()).totalAssets()).mul(FixedPointLibrary.fullYield());
    }

    function excess(FixedPointValue memory totalAssets) {
        if (allocation() > targetAllocation()) {
            FixedPointValue memory targetBalance = totalAssets.div(FixedPointLibrary.fullYield()).mul(targetAllocation());
            FixedPointValue memory actualBalance = totalAssets.div(FixedPointLibrary.fullYield()).mul(allocation());
            return actualBalance.sub(targetBalance);
        }
        return 0;
    }

    function deficit() {
        if (allocation() < targetAllocation()) {
            FixedPointValue memory targetBalance = totalAssets.div(FixedPointLibrary.fullYield()).mul(targetAllocation());
            FixedPointValue memory actualBalance = totalAssets.div(FixedPointLibrary.fullYield()).mul(allocation());
            return targetBalance.sub(actualBalance);   
        }
        return 0;
    }

    function optimalAssetValue() public view returns (FixedPointValue memory asEther) {
        return UniswapV2PairStruct({ path: path(), router: router(), factory: factory() }).optimalAssetValue(owner());
    }

    function actualAssetValue() public view returns (FixedPointValue memory asEther) {
        return UniswapV2PairStruct({ path: path(), router: router(), factory: factory() }).actualAssetValue(owner());
    }

    function yield(FixedPointValue memory amountIn) public view returns (FixedPointValue memory percentageAsEther) {
        return UniswapV2PairStruct({ path: path(), router: router(), factory: factory() }).yield(amountIn);
    }

    function optimalAmountOut(FixedPointValue memory amountIn) public view returns (FixedPointValue memory asEther) {
        return UniswapV2PairStruct({ path: path(), router: router(), factory: factory() }).optimalAmountOut(amountIn);
    }

    function actualAmountOut(FixedPointValue memory amountIn) public view returns (FixedPointValue memory asEther) {
        return UniswapV2PairStruct({ path: path(), router: router(), factory: factory() }).actualAmountOut(amountIn);
    }

    function quote() public view returns (FixedPointValue memory asEther) {
        return UniswapV2PairStruct({ path: path(), router: router(), factory: factory() }).quote();
    }
}