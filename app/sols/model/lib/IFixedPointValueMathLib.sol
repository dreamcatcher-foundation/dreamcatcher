// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IBase } from "../../base/IBase.sol";
import { IFixedPointValueMathFacet } from "../../facet/pure/fixedPointValueMath/IFixedPointValueMathFacet.sol";

interface IFixedPointValueMathLib is
    /***/IBase,
    /***/IFixedPointValueMathFacet
    {}