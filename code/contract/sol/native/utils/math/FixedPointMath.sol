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

    function add(FixedPointValue memory num0, FixedPointValue memory num1) public pure returns (FixedPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 value0;
        uint256 value1;
        uint256 result;
        decimals0 = num0.decimals;
        decimals1 = num1.decimals;
        value0 = num0.value;
        value1 = num1.value;
        result = value0 + value1;
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
        return FixedPointValue({value: result, decimals: decimals0});        
    }

    function sub(FixedPointValue memory num0, FixedPointValue memory num1) public pure returns (FixedPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 value0;
        uint256 value1;
        uint256 result;
        decimals0 = num0.decimals;
        decimals1 = num1.decimals;
        value0 = num0.value;
        value1 = num1.value;
        result = value0 - value1;
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
        return FixedPointValue({value: result, decimals: decimals0});
    }

    function mul(FixedPointValue memory num0, FixedPointValue memory num1) public pure returns (FixedPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 value0;
        uint256 value1;
        uint256 result;
        uint256 representation;
        decimals0 = num0.decimals;
        decimals1 = num1.decimals;
        value0 = num0.value;
        value1 = num1.value;
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
        if (decimals0 == 0) {
            result = value0 * value1;
            return FixedPointValue({value: result, decimals: decimals0});
        }
        if (value0 == 0 || value1 == 0) return FixedPointValue({value: 0, decimals: decimals0});
        representation = 10**decimals0;
        result = value0.mulDiv(value1, representation);
        return FixedPointValue({value: result, decimals: decimals0});
    }

    function div(FixedPointValue memory num0, FixedPointValue memory num1) public pure returns (FixedPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 value0;
        uint256 value1;
        uint256 result;
        uint256 representation;
        decimals9 = num0.decimals;
        decimals1 = num1.decimals;
        value0 = num0.value;
        value1 = num1.value;
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
        representation = 10**decimals0;
        result = value0.mulDiv(representation, value1);
        return FixedPointValue({value: result, decimals: decimals0});
    }

    function assign(FixedPointValue memory num0, FixedPointValue memory num1) public pure returns (FixedPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 value0;
        uint256 value1;
        FixedPointValue memory difference;
        FixedPointValue memory result;
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
        if (value0 > value1) {
            difference = num0.sub(num1);
            result = num0.sub(difference);
            return result;
        }
        else if (value0 < value1) {
            difference = num1.sub(num0);
            result = num0.add(difference);
            return result;
        }
        else {
            return num0;
        }
    }

    function asEther(FixedPointValue memory num) public pure returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 value;
        uint256 result;
        decimals = num.decimals;
        value = num.value;
        if (value == 0) return FixedPointValue({value: 0, decimals: ether_()});
        result = ((value * (10**ether_()) / (10**decimals)) * (10**ether_())) / (10**ether_());
        return FixedPointValue({value: result, decimals: ether_()});
    }

    function asNewDecimals(FixedPointValue memory num, uint8 decimals) public pure returns (FixedPointValue memory) {
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

    function scale(FixedPointValue memory num0, FixedPointValue memory num1) public pure returns (BasisPointValue memory) {
        uint8 decimals0;
        uint8 decimals1;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        decimals0 = num0.decimals;
        decimals1 = num1.decimals;
        representation = 10**decimals0;
        scale = FixedPointValue({value: 10_000 * representation, decimals: decimals0});
        if (decimals0 != decimals1) revert IncompatibleDecimals(decimals0, decimals1);
        result = num0.div(num1).mul(scale);
        return BasisPointValue({value: result});
    }

    function slice(FixedPointValue memory num, BasisPointValue memory portion) public pure returns (FixedPointValue memory) {
        uint8 decimals;
        uint256 representation;
        FixedPointValue memory result;
        FixedPointValue memory scale;
        FixedPointValue memory portionAsFixedPointValue;
        decimals = num.decimals;
        representation = 10**decimals;
        scale = FixedPointValue({value: 10_000 * representation, decimals: decimals});
        portionAsFixedPointValue = portion.value;
        result = num.div(scale).mul(portionAsFixedPointValue);
        return result;
    }

    function ether_() private pure returns (uint8) {
        return Static.ether();
    }
}