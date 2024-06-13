// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { FixedPointValue } from "../../../shared/FixedPointValue.sol";

interface IFixedPointValueMathFacet {
    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) external pure returns (FixedPointValue memory);
    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory proportion);
    function sum(FixedPointValue[] memory numbers, uint8 decimals) external pure returns (FixedPointValue memory);
    function min(FixedPointValue[] memory numbers, uint8 decimals) external pure returns (FixedPointValue memory);
    function max(FixedPointValue[] memory numbers, uint8 decimals) external pure returns (FixedPointValue memory);
    function isEqual(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isLessThan(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isMoreThan(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isLessThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function isMoreThanOrEqual(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (bool);
    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function add(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function asEther(FixedPointValue memory number) external pure returns (FixedPointValue memory);
    function asNewDecimals(FixedPointValue memory number) external pure returns (FixedPointValue memory);
    function representation(uint8 decimals) external pure returns (uint256);
    function mulDiv(uint256 number0, uint256 number1, uint256 number2) external pure returns (uint256);
}