// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { UniswapV2Swapper } from "./UniswapV2Swapper.sol";
import { ShareMath } from "../math/ShareMath.sol";

struct Slots {
    address[] _slots;
}

contract UniswapV2Broker is UniswapV2Swapper, ShareMath {
    
}