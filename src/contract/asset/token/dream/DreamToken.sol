// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import {ERC20} from "../../../import/openzeppelin/token/ERC20/ERC20.sol";

contract DreamToken is ERC20 {

    constructor() ERC20("Dream", "DREAM") {
        _mint(msg.sender, 200000000 ether);
    }
}