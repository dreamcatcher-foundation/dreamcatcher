// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import './StateMod.sol';
import '../../shared/IGenerator.sol';

interface ITrackerStateMod is IStateMod {
    event Change(uint8 slotId, address token);

    function get(uint8 i) external view returns (address);
    function set(uint8 i, address token) external returns (bool);
}

contract TrackerStateMod is ITrackerStateMod, StateMod {

    /**
    * -> Tracks a maximum of 16 assets of which the first one is
    *    the base asset. We can upgrade this in the future to implement
    *    more, but 16 is a safe number. From tests this does well up to
    *    32 as well.
     */
    address[16] private _holdings;

    constructor() StateMod() {}

    function get(uint8 slodId) public view virtual returns (address) {
        return _holdings[slotId];
    }

    function set(uint8 slotId, address token) external virtual onlyImplementation() returns (bool) {
        return _set(slotId, token);
    }

    function _set(uint8 slotId, address token) internal virtual returns (bool) {
        return set_(slotId, token);
    }

    function set_(uint8 slotId, address token) private returns (bool) {
        _holdings[i] = token;
        emit Change(slotId, token);
        return true;
    }
}

contract TrackerStateModGenerator is IGenerator {
    constructor() {}

    function generate() external virtual returns (address) {
        address module = address(new TrackerStateMod());
        emit Generation(msg.sender, module);
        return module;
    }
}