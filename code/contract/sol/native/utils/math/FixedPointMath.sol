// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { Math } from "../../../non-native/openzeppelin/utils/math/Math.sol";
import { FixedPointValue } from "../class/FixedPointValue.sol";

interface IFixedPointMath {
    scale(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory basisPoints);
    slice(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    add(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    sub(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    mul(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    div(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory);
    asNewDecimals(FixedPointValue memory num, uint8 decimals) external pure returns (FixedPointValue memory);
    asEther(FixedPointValue memory num) external pure returns (FixedPointValue memory);
}

contract FixedPointMath {
    using Math for uint256;

    error IncompatibleDecimals(uint8 decimals0, uint8 decimals1);

    modifier onlyMatchingFixedPointValueType(FixedPointValue memory num0, FixedPointValue memory num1) {
        uint8 decimals0;
        uint8 decimals1;
        decimals0 = num0.decimals;
        decimals1 = num1.decimals;
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
        _;
    }

    function scale(FixedPointValue memory num0, FixedPointValue memory num1) public pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory basisPoints) {
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals = num0.decimals;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000 * representation, decimals: decimals});
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
        if (decimals == 0) {
            result = value0 * value1;
            return FixedPointValue({value: result, decimals: decimals});
        }
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
        uint8 currentDecimals;
        uint256 value;
        uint256 result;
        currentDecimals = num.decimals;
        value = num.value;
        if (currentDecimals != 18) {
            FixedPointValue memory numAsEther;
            numAsEther = asEther(num);
            value = numAsEther.value;
        }
        result = ((value * (10**18) / (10**18)) * (10**decimals)) / (10**18);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function asEther(FixedPointValue memory num) public pure returns (FixedPointValue memory) {
        uint8 currentDecimals;
        uint256 value;
        uint256 result;
        currentDecimals = num.decimals;
        value = num.value;
        result = ((value * (10**18) / (10**currentDecimals)) * (10**18)) / (10**18);
        return FixedPointValue({value: result, decimals: 18});
    }
}