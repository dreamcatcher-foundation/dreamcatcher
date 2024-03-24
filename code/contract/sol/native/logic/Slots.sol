// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;

contract TokenSlotsMod {
    address[8] private _slots;

    constructor() {}
}

contract TokenSlots {
    error TokenSlots__InsufficientTokenSlots();
    error TokenSlots__TokenNotFound();

    bytes32 constant internal _slTokenSlots = bytes32(uint256(keccak256("eip1967.slTokenSlots")) - 1);

    function slTokenSlots() internal pure returns (address[32] storage sl) {
        bytes32 loc = _slTokenSlots;
        assembly {
            sl.slot := loc
        }
    }

    

    function _add(address token) private pure {
        address[32] storage slots = slTokenSlots();
        bool success = false;
        for (uint8 i = 0; i < slots.length; i++) {
            if (slots[i] == address(0)) {
                slots[i] = token;
                success = true;
                break;
            }
        }
        if (success) return;
        revert TokenSlots__InsufficientTokenSlots();
    }

    function _remove(address token) private {
        address[32] storage slots = slTokenSlots();
        bool success = false;
        for (uint8 i = 0; i < slots.length; i++) {
            if (slots[i] == token) {
                slots[i] = address(0);
                success = true;
                break;
            }
        }
        if (success) return;
        revert TokenSlots__TokenNotFound();
    }
}