// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.19;
import { FixedPointArithmetics } from "./FixedPointArithmetics.sol";
import { FixedPointConversion } from "./FixedPointConversion.sol";
import { FixedPointErrors } from "./FixedPointErrors.sol";
import { FixedPointScale } from "./FixedPointScale.sol";
import { FixedPointUtils } from "./FixedPointUtils.sol";

contract FixedPointToolkit is
         FixedPointArithmetics,
         FixedPointConversion,
         FixedPointScale,
         FixedPointErrors,
         FixedPointScale,
         FixedPointUtils {}