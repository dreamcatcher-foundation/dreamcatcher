AuthPlugIn
    membersOf(string,uint256)
    membersOf(string)
    membersLengthOf(string)
    hasRole(address,string)
    hasRole(string)
    claimOwnership()
    transferRole(address,address,string)

PlugInRouterPlugIn [ AuthSocket ]
    versionsOf(string,uint256)
    versionsOf(string)
    versionsLengthOf(string)
    latestVersionOf(string)
    * commit(string,address)

TokenPlugIn
    symbol()
    decimals()
    totalSupply()
    balanceOf(address)
    allowance(address,address)
    transfer(address,uint256)
    transferFrom(address,address,uint256)
    approve(address,uint256)
    increaseAllowance(address,uint256)
    decreaseAllowance(address,uint256)

TokenSetterPlugIn [ AuthSocket ]
    * setTokenSymbol(string)

TokenMintPlugIn [ AuthSocket ]
    * mint(address,uint256)

TokenBurnPlugIn [ AuthSocket ]
    * burn(address,uint256)