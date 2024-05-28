AuthFacet
    membersOf(string,uint256)
    membersOf(string)
    membersLengthOf(string)
    hasRole(address,string)
    hasRole(string)
    claimOwnership()
    transferRole(address,address,string)

TokenFacet
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

TokenSetterFacet [ AuthSocket ]
    * setTokenSymbol(string)

TokenMintFacet [ AuthSocket ]
    * mint(address,uint256)

TokenBurnFacet [ AuthSocket ]
    * burn(address,uint256)