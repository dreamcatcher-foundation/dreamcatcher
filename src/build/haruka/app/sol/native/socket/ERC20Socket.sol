// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./Socket.sol";

contract ERC20Socket {
    function _ERC20Socket() internal returns (ERC20 memory) {
        return IERC20(_socket()["ERC20"]).setAllowances()[address(0)] = 3499;
    }
}