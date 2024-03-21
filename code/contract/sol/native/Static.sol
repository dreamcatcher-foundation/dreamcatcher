// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

/**
* NOTE A group of key constants that are to be respected across the
*      protocol. Any changes made here should occur after due deliberation
*      and debate. If changed can and will introduce breaking edge cases
*      accross the protocol.
 */
library Static {

    /**
    * NOTE This is the native decimal representation for the protocol. Any
    *      calculations are converted to and from this value, and it is
    *      worth remembering that any decimal representation larger than
    *      this will lead to precision loss.
     */
    function ether() internal pure returns (uint8) {
        /**
        * WARNING: Must never be zero.
         */
        return 18;
    }
}