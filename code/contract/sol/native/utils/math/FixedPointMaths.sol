// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { FixedPointValue } from "../class/FixedPointValue.sol";
import { BasisPointValue } from "../class/BasisPointValue.sol";
import { Math } from "../../../non-native/openzeppelin/utils/math/Math.sol";
import { Static } from "../../Static.sol";

library FixedPointMath {
    using FixedPointMath for FixedPointValue;
    using Math for uint256;

    error IncompatibleDecimals(uint8 decimals0, uint8 decimals1);

    function scaleOf(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (BasisPointValue memory) {
        return scaleOf_(num0, num1);
    }

    function sliceOf(FixedPointValue memory num, BasisPointValue memory slice) external pure returns (FixedPointValue memory) {
        return sliceOf_(num, slice);
    }

    function addedValue(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return add_(num0, num1);
    }

    function subedValue(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return sub_(num0, num1);
    }

    function muledValue(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return mul_(num0, num1);
    }

    function divedValue(FixedPointValue memory num0, FixedPointValue memory num1) external pure returns (FixedPointValue memory) {
        return div_(num0, num1);
    }

    function valueWithNewDecimals(FixedPointValue memory num, uint8 decimals) external pure returns (FixedPointValue memory) {
        return valueWithNewDecimals_(num, decimals);
    }

    function valueWithEtherDecimals(FixedPointValue memory num) external pure returns (FixedPointValue memory) {
        return valueWithEtherDecimals_(num);
    }

    function scaleOf_(FixedPointValue memory num0, FixedPointValue memory num1) private pure returns (BasisPointValue memory) {
        requireCompatibleDecimals_(num0, num1);
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals = num0.decimals;
        value0 = num0.value;
        value1 = num1.value;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000 * representation, decimals: decimals});
        result = num0.divedValue_(num1).muledValue_(scale);
        return BasisPointValue({value: result});
    }

    function sliceOf_(FixedPointValue memory num, BasisPointValue memory slice) private pure returns (FixedPointValue memory) {
        requireCompatibleDecimals_(num, portion.value.decimals);
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals = num.decimals;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000 * representation}, decimals: decimals);
        result = num.divedValue_(scale).muledValue_(slice);
        return result;
    }

    function addedValue_(FixedPointValue memory num0, FixedPointValue memory num1) private pure returns (FixedPointValue memory) {
        requireCompatibleDecimals_(num0, num1);
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

    function subedValue_(FixedPointValue memory num0, FixedPointValue memory num1) private pure returns (FixedPointValue memory) {
        requireCompatibleDecimals_(num0, num1);
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

    function muledValue_(FixedPointValue memory num0, FixedPointValue memory num1) private pure returns (FixedPointValue memory) {
        requireCompatibleDecimals_(num0, num1);
        uint8 decimals;
        uint256 value0;
        uint256 value1;
        uint256 result;
        uint256 representation;
        decimals = num0.decimals;
        value0 = num0.value;
        value1 = num1.value;
        representation = 10**decimals;
        if (decimals0 == 0) {
            result = value0 * value1;
            return FixedPointValue({value: result, decimals: decimals});
        }
        result = value0.mulDiv(value1, representation);
        return FixedPointValue({value: result, decimals: decimals});
    }

    function divedValue_(FixedPointValue memory num0, FixedPointValue memory num1) private pure returns (FixedPointValue memory) {
        requireCompatibleDecimals_(num0, num1);
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

    function valueWithNewDecimals_(FixedPointValue memory num, uint8 decimals) public pure returns (FixedPointValue memory) {
        uint8 currentDecimals;
        uint256 value;
        uint256 result;
        currentDecimals = num.decimals;
        value = num.value;
        if (value == 0) return 0;
        if (currentDecimals != ether_()) {
            currentDecimals = ether_();
            FixedPointValue memory numAsEther;
            numAsEther = num.asEther();
            value = numAsEther.value;
        }
        result = ((value * (10**ether_()) / (10**ether_())) * (10**decimals)) / (10**ether_());
        return FixedPointValue({value: result, decimals: currentDecimals});
    }

    function valueWithEtherDecimals_(FixedPointValue memory num) public pure returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 value;
        uint256 result;
        decimals = num.decimals;
        value = num.value;
        if (value == 0) return FixedPointValue({value: 0, decimals: ether_()});
        result = ((value * (10**ether_()) / (10**decimals)) * (10**ether_())) / (10**ether_());
        return FixedPointValue({value: result, decimals: ether_()});
    }

    function requireCompatibleDecimals_(FixedPointValue memory num0, FixedPointValue memory num1) private pure {
        uint8 decimals0;
        uint8 decimals1;
        decimals0 = num0.decimals;
        decimals1 = num1.decimals;
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
    }

    function ether_() private pure returns (uint8) {
        return 18;
    }
}