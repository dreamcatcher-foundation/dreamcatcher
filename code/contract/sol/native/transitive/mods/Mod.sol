// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import './state/StateMod.sol';

interface IMod is IStateMod {}

contract Mod is IMod {
    constructor() StateMod() {}
}