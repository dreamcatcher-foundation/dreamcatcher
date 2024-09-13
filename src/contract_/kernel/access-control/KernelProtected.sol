// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract KernelProtected {
    event KernelProtected__OperatorAdded();
    event KernelProtected__OperatedRemoved();
    error KernelProtected__Unauthorized();

    address[16] private _operators;

    modifier protected() {
        
        _;
    }

    function operators() public view virtual returns (address[] memory) {
        address[] memory temporary = new address[](_operators.length);
        for (uint256 i = 0; i < temporary.length; i++) temporary[i] = _operators[i];
        return temporary;
    }

    function _addOperator(address account) internal virtual {
        
    }
}