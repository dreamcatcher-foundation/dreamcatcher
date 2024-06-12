// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;



function _representation(uint8 decimals) internal pure returns (uint256) {
    return 10 ** decimals;
}

function _mulDiv(uint256 number0, uint256 number1, uint256 number2) internal pure returns (uint256) {
    return Math.mulDiv(number0, number1, number2);
}

function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1, FixedPointValue memory number2) internal pure returns (bool) {
    if (number0.decimals != number1.decimals) {
        revert IncompatibleDecimals();
    }
    if (number0.decimals != number2.deicmals) {
        revert IncompatibleDecimals();
    }
    return true;
}

function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1) internal pure returns (bool) {
    if (number0.decimals != number1.decimals) {
        revert IncompatibleDecimals();
    }
    return true;
}
