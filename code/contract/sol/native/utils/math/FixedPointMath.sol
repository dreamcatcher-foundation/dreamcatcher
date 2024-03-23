// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { Math } from "../../../non-native/openzeppelin/utils/math/Math.sol";
import { FixedPointValue } from "../../shared/FixedPointValue.sol";

interface IFixedPointMath {
    function scale(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory basisPoints);
    function slice(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    function add(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    function asNewDecimals(FixedPointValue memory num, uint8 decimals) external pure returns (FixedPointValue memory);
    function asEther(FixedPointValue memory num) external pure returns (FixedPointValue memory);
}

contract FixedPointMath {
    using Math for uint256;

    error IncompatibleDecimals(uint8 decimals0, uint8 decimals1);

    modifier onlyMatchingFixedPointValueType(FixedPointValue memory num0, FixedPointValue memory num1) {
        if (num0.decimals != num1.decimals) {
            revert IncompatibleDecimals(num0.decimals, num1.decimals);
        }
        _;
    }

    function scale(FixedPointValue memory num0, FixedPointValue memory num1) public pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory basisPoints) {
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals = num0.decimals;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000, decimals: 0});
        scale = asNewDecimals(scale, decimals);
        result = div(num0, num1);
        result = mul(result, scale);
        return result;
    }

    function slice(FixedPointValue memory num, FixedPointValue memory sliceBasisPoints) public pure onlyMatchingFixedPointValueType(num, sliceBasisPoints) returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals = num.decimals;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000 * representation, decimals: decimals});
        result = div(num, scale);
        result = mul(result, sliceBasisPoints);
        return result;
    }

    function add(FixedPointValue memory num0, FixedPointValue memory num1) public pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 value0;
        uint256 value1;
        uint256 result;
        decimals = num0.decimals;
        value0 = num0.value;
        value1 = num1.value;
        result = value0 + value1;
        return FixedPointValue({value: result, decimals: decimals});
    }

    function sub(FixedPointValue memory num0, FixedPointValue memory num1) public pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 value0;
        uint256 value1;
        uint256 result;
        decimals = num0.decimals;
        value0 = num0.value;
        value1 = num1.value;
        result = value0 - value1;
        return FixedPointValue({value: result, decimals: decimals});
    }

    function mul(FixedPointValue memory num0, FixedPointValue memory num1) public pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 value0;
        uint256 value1;
        uint256 result;
        uint256 representation;
        decimals = num0.decimals;
        value0 = num0.value;
        value1 = num1.value;
        representation = 10**decimals;
        result = value0.mulDiv(value1, representation);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function div(FixedPointValue memory num0, FixedPointValue memory num1) public pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 value0;
        uint256 value1;
        uint256 result;
        uint256 representation;
        decimals = num0.decimals;
        value0 = num0.value;
        value1 = num1.value;
        representation = 10**decimals;
        result = value0.mulDiv(representation, value1);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function asNewDecimals(FixedPointValue memory num, uint8 decimals) public pure returns (FixedPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 representation0;
        uint256 representation1;
        uint256 value;
        decimals0 = num.decimals;
        decimals1 = decimals;
        representation0 = 10**decimals0;
        representation1 = 10**decimals1;
        value = num.value;
        value = value.mulDiv(representation1, representation0);
        return FixedPointValue({value: value, decimals: decimals1}); 
    }

    function asEther(FixedPointValue memory num) public pure returns (FixedPointValue memory) {
        return asNewDecimals(num, 18);
    }
}