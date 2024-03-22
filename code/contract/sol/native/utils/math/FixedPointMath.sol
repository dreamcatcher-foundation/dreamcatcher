// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { Math } from "../../../non-native/openzeppelin/utils/math/Math.sol";
import { FixedPointValue } from "../class/FixedPointValue.sol";

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

    function scale(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory basisPoints) {
        return scale_(num0, num1);
    }

    function slice(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return slice_(num0, num1);
    }

    function add(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return add_(num0, num1);
    }

    function sub(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return sub_(num0, num1);
    }

    function mul(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return mul_(num0, num1);
    }

    function div(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return div_(num0, num1);
    }

    function asNewDecimals(FixedPointValue memory num, uint8 decimals) external pure returns (FixedPointValue memory) {
        return asNewDecimals_(num, decimals);
    }

    function asEther(FixedPointValue memory num) external pure returns (FixedPointValue memory) {
        return asEther_(num);
    }

    function scale_(FixedPointValue memory num0, FixedPointValue memory num1) private pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory basisPoints) {
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals = num0.decimals;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000 * representation, decimals: decimals});
        result = div_(num0, num1);
        result = mul_(result, scale);
        return result;
    }

    function slice_(FixedPointValue memory num, FixedPointValue memory sliceBasisPoints) private pure onlyMatchingFixedPointValueType(num, sliceBasisPoints) returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals = num.decimals;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000 * representation, decimals: decimals});
        result = div_(num, scale);
        result = mul_(result, sliceBasisPoints);
        return result;
    }

    function add_(FixedPointValue memory num0, FixedPointValue memory num1) private pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
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

    function sub_(FixedPointValue memory num0, FixedPointValue memory num1) private pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
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

    function mul_(FixedPointValue memory num0, FixedPointValue memory num1) private pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
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

    function div_(FixedPointValue memory num0, FixedPointValue memory num1) private pure onlyMatchingFixedPointValueType(num0, num1) returns (FixedPointValue memory) {
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

    function asNewDecimals_(FixedPointValue memory num, uint8 decimals) private pure returns (FixedPointValue memory) {
        uint8 currentDecimals;
        uint256 value;
        uint256 result;
        currentDecimals = num.decimals;
        value = num.value;
        if (currentDecimals != 18) {
            FixedPointValue memory numAsEther;
            numAsEther = asEther_(num);
            value = numAsEther.value;
        }
        result = ((value * (10**18) / (10**18)) * (10**decimals)) / (10**18);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function asEther_(FixedPointValue memory num) private pure returns (FixedPointValue memory) {
        uint8 currentDecimals;
        uint256 value;
        uint256 result;
        currentDecimals = num.decimals;
        value = num.value;
        result = ((value * (10**18) / (10**currentDecimals)) * (10**18)) / (10**18);
        return FixedPointValue({value: result, decimals: 18});
    }
}