// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;
import "../../../non-native/openzeppelin/utils/math/Math.sol";
import "../../shared/FixedPointValue.sol";
import "../IFacet.sol";

interface IFixedPointMathPureFacet is 
    IFixedPointMathPureFacetPercentagesFragment, 
    IFixedPointMathPureFacetArithmeticsFragment, 
    IFixedPointMathPureFacetTypeCheckedArithmeticsFragment, 
    IFixedPointMathPureFacetConversionFragment,
    IFacet {}

contract FixedPointMathPureFacet is 
    FixedPointMathPureFacetPercentagesFragment, 
    FixedPointMathPureFacetArithmeticsFragment, 
    FixedPointMathPureFacetTypeCheckedArithmeticsFragment, 
    FixedPointMathPureFacetConversionFragment, 
    FixedPointMathPureFacetTypeCheckerFragment {
    
    function selectors() public pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](15);
        selectors[0] = bytes4(keccak256("slice((uint256,uint8),(uint256,uint8),uint8)"));
        selectors[1] = bytes4(keccak256("slice((uint256,uint8),(uint256,uint8))"));
        selectors[2] = bytes4(keccak256("scale((uint256,uint8),(uint256,uint8),uint8)"));
        selectors[3] = bytes4(keccak256("scale((uint256,uint8),(uint256,uint8))"));
        selectors[4] = bytes4(keccak256("tenThousand(uint8)"));
        selectors[5] = bytes4(keccak256("add((uint256,uint8),(uint256,uint8),uint8)"));
        selectors[6] = bytes4(keccak256("sub((uint256,uint8),(uint256,uint8),uint8)"));
        selectors[7] = bytes4(keccak256("mul((uint256,uint8),(uint256,uint8),uint8)"));
        selectors[8] = bytes4(keccak256("div((uint256,uint8),(uint256,uint8),uint8)"));
        selectors[9] = bytes4(keccak256("add((uint256,uint8),(uint256,uint8))"));
        selectors[10] = bytes4(keccak256("sub((uint256,uint8),(uint256,uint8))"));
        selectors[11] = bytes4(keccak256("mul((uint256,uint8),(uint256,uint8))"));
        selectors[12] = bytes4(keccak256("div((uint256,uint8),(uint256,uint8))"));
        selectors[13] = bytes4(keccak256("asEther((uint256,uint8))"));
        selectors[14] = bytes4(keccak256("asNewDecimals((uint256,uint8),uint8)"));
        return selectors;
    }
}

interface IFixedPointMathPureFacetPercentagesFragment is
    IFixedPointMathPureFacetArithmeticsFragment {
    
    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) external pure returns (FixedPointValue memory);
    function slice(FixedPointValue memory number, FixedPointValue memory slice) external pure returns (FixedPointValue memory);
    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function scale(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
}

contract FixedPointMathPureFacetPercentagesFragment is 
    FixedPointMathPureFacetArithmeticsFragment {

    function slice(FixedPointValue memory number, FixedPointValue memory slice, uint8 decimals) public pure returns (FixedPointValue memory) {
        number = asNewDecimals(number, decimals);
        slice = asNewDecimals(slice, decimals);
        return slice(number, slice);
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure returns (FixedPointValue memory) {
        number0 = asNewDecimals(number0, decimals);
        number1 = asNewDecimals(number1, decimals);
        return scale(number0, number1);
    }

    function slice(FixedPointValue memory number, FixedPointValue memory slice) public pure checkTypes0(number, slice) returns (FixedPointValue memory) {
        uint8 decimals = number.decimals;
        FixedPointValue memory result = div(number, tenThousand(decimals));
        result = mul(result, slice);
        result = asNewDecimals(result, decimals);
        return result;
    }

    function scale(FixedPointValue memory number0, FixedPointValue memory number1) public pure checkTypes0(number0, number1) returns (FixedPointValue memory) {
        uint8 decimals = number0.decimals;
        FixedPointValue memory result = div(number0, number1);
        result = mul(result, tenThousand(decimals));
        result = asNewDecimals(result, decimals);
        return result;
    }

    function tenThousand(uint8 decimals) public pure returns (FixedPointValue memory) {
        FixedPointValue memory result = FixedPointValue({value: 10000, decimals: 0});
        return asNewDecimals(result, decimals);
    }
}

interface IFixedPointMathPureFacetArithmeticsFragment {
    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) external pure returns (FixedPointValue memory);
}

contract FixedPointMathPureFacetArithmeticsFragment is 
    FixedPointMathPureFacetTypeCheckedArithmeticsFragment {

    function add(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure returns (FixedPointValue memory) {
        number0 = asNewDecimals(number0, decimals);
        number1 = asNewDecimals(number1, decimals);
        return add(number0, number1);
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure returns (FixedPointValue memory) {
        number0 = asNewDecimals(number0, decimals);
        number1 = asNewDecimals(number1, decimals);
        return sub(number0, number1);
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure returns (FixedPointValue memory) {
        number0 = asNewDecimals(number0, decimals);
        number1 = asNewDecimals(number1, decimals);
        return mul(number0, number1);
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1, uint8 decimals) public pure returns (FixedPointValue memory) {
        number0 = asNewDecimals(number0, decimals);
        number1 = asNewDecimals(number1, decimals);
        return div(number0, number1);
    }
}

interface IFixedPointMathPureFacetTypeCheckedArithmeticsFragment {
    function add(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function sub(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function mul(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
    function div(FixedPointValue memory number0, FixedPointValue memory number1) external pure returns (FixedPointValue memory);
}

contract FixedPointMathPureFacetTypeCheckedArithmeticsFragment is 
    FixedPointMathPureFacetTypeCheckerFragment {
        
    using Math for uint256;

    function add(FixedPointValue memory number0, FixedPointValue memory number1) public pure checkTypes0(number0, number1) returns (FixedPointValue memory) {
        uint8 decimals = number0.decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 addResult = value0 + value1;
        return FixedPointValue({value: addResult, decimals: decimals});
    }

    function sub(FixedPointValue memory number0, FixedPointValue memory number1) public pure checkTypes0(number0, number1) returns (FixedPointValue memory) {
        uint8 decimals = number0.decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 subResult = value0 - value1;
        return FixedPointValue({value: subResult, decimals: decimals});
    }

    function mul(FixedPointValue memory number0, FixedPointValue memory number1) public pure checkTypes0(number0, number1) returns (FixedPointValue memory) {
        uint8 decimals = number0.decimals;
        uint256 representation = 10**decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 mulDivResult = value0.mulDiv(value1, representation);
        return FixedPointValue({value: mulDivResult, decimals: decimals});
    }

    function div(FixedPointValue memory number0, FixedPointValue memory number1) public pure checkTypes0(number0, number1) returns (FixedPointValue memory) {
        uint8 decimals = number0.decimals;
        uint256 representation = 10**decimals;
        uint256 value0 = number0.value;
        uint256 value1 = number1.value;
        uint256 mulDivResult = value0.mulDiv(representation, value1);
        return FixedPointValue({value: mulDivResult, decimals: decimals});
    }
}

interface IFixedPointMathPureFacetConversionFragment {
    asEther(FixedPointValue memory number) external pure returns (FixedPointValue memory);
    asNewDecimals(FixedPointValue memory number, uint8 decimals) external pure returns (FixedPointValue memory);
}

contract FixedPointMathPureFacetConversionFragment {
    using Math for uint256;

    function asEther(FixedPointValue memory number) public pure returns (FixedPointValue memory) {
        return asNewDecimals(number, 18);
    }

    function asNewDecimals(FixedPointValue memory number, uint8 decimals) public pure returns (FixedPointValue memory) {
        uint8 decimals0 = number.decimals;
        uint8 decimals1 = decimals;
        uint256 representation0 = 10**decimals0;
        uint256 representation1 = 10**decimals1;
        uint256 value = number.value;
        uint256 mulDivResult = value.mulDiv(representation1, representation0);
        return FixedPointValue({value: mulDivResult, decimals: decimals1});
    }
}

contract FixedPointMathPureFacetTypeCheckerFragment {
    error TypeError0(FixedPointValue number0, FixedPointValue number1);
    error TypeError1(FixedPointValue number0, FixedPointValue number1, FixedPointValue number2);

    modifier checkTypes0(FixedPointValue memory number0, FixedPointValue memory number1) {
        _checkTypes(number0, number1);
        _;
    }

    modifier checkTypes1(FixedPointValue number0, FixedPointValue number1, FixedPointValue number2) {
        _checkTypes(number0, number1, number2);
        _;
    }

    function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1, FixedPointValue memory number2) private pure returns (bool) {
        uint8 decimals0 = number0.decimals;
        uint8 decimals1 = number1.decimals;
        uint8 decimals2 = number2.decimals;
        if (decimals0 != decimals1) {
            revert TypeError1(number0, number1, number2);
        }
        if (decimals0 != decimals2) {
            revert TypeError1(number0, number1, number2);
        }
        return true;
    }

    function _checkTypes(FixedPointValue memory number0, FixedPointValue memory number1) private pure returns (bool) {
        uint8 decimals0 = number0.decimals;
        uint8 decimals1 = number1.decimals;
        if (decimals0 != decimals1) {
            revert TypeError0(number0, number1);
        }
        return true;
    }
}