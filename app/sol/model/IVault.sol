// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IAuthFacet } from "./facet/accessControl/auth/IAuthFacet.sol";
import { IStandardTokenFacet } from "./facet/token/standardToken/IStandardTokenFacet.sol";
import { IStandardTokenMintFacet } from "./facet/token/standardToken/IStandardTokenMintFacet.sol";
import { IStandardTokenBurnFacet } from "./facet/token/standardToken/IStandardTokenBurnFacet.sol";
import { IStandardTokenSetterFacet } from "./facet/token/standardToken/IStandardTokenSetterFacet.sol";

interface IVault is
    /***/IAuthFacet,
    /***/IStandardTokenFacet,
    /***/IStandardTokenMintFacet,
    /***/IStandardTokenBurnFacet,
    /***/IStandardTokenSetterFacet 
    {}