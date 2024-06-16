// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "./FixedPointValue.sol";

interface IFixedPointMath {
    function yield(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory BPR18);
    function zeroYield() external pure returns (FixedPointValue memory BPR18);
    function fullYield() external pure returns (FixedPointValue memory BPR18);
    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) external pure returns (FixedPointValue memory);
    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue BPR18);
    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isLessThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isMoreThanOrEqualTo(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function add(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory R18);
    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory R18);
    function toEther(FixedPointValue memory number) external pure returns (FixedPointValue memory R18);
    function toDecimals(FixedPointValue memory number, uint8 decimals) external pure returns (FixedPointValue memory);
}