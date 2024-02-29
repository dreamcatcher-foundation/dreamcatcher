
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\misc\templates\mirai\solstice-v1.2.0\__SharedDeclarations.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: Apache-2.0
pragma solidity ^0.8.19;
////import "contracts/polygon/deps/openzeppelin/utils/structs/EnumerableSet.sol";

library __SharedDeclarations {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    enum CollatTState {
        DEFAULT,
        FULFILLED,
        UNFULFILLED
    }

    enum PoolState {
        UNPAUSED,
        PAUSED
    }

    struct Fee {
        uint create;
        uint contribute;
        uint withdraw;
        uint update;
    }

    struct Settings {
        Fee fee;
        uint collatTScheduleDuration;
    }

    struct CollatTSchedule {
        uint startTimestamp;
        uint endTimestamp;
        uint duration;
        uint valueLocked;
        CollatTState state;
    }

    struct Pool {
        string name;
        string description;
        address creator;
        EnumerableSet.AddressSet admins;
        EnumerableSet.AddressSet managers;
        EnumerableSet.AddressSet contracts;
        EnumerableSet.UintSet amounts;
        uint balance;
        EnumerableSet.AddressSet whitelist;
        EnumerableSet.AddressSet participants;
        PoolState state;
    }
}
