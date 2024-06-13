// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;


library TokenUtilLib {
    function balance() internal view returns (FixedPointValue memory asEther) {
        
    }
}



contract TokenTracker {
    Asset[] private _assets;

    function track(address asset) {
        _assets.push(new Asset(asset));
    }

    
}


interface IAsset {
    balance() external view returns (FixedPointValue);
}

contract Asset {
    address private _wallet;

    constructor() {}

    function balance() {
        
    }

    
}