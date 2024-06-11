// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IBase } from "../base/IBase.sol";
import { IAuthFacet } from "./facet/accessControl/auth/IAuthFacet.sol";
import { ITokenFacet } from "./facet/token/standardToken/IStandardTokenFacet.sol";
import { ITokenMintFacet } from "./facet/token/standardToken/IStandardTokenMintFacet.sol";
import { ITokenBurnFacet } from "./facet/token/standardToken/IStandardTokenBurnFacet.sol";
import { ITokenSetterFacet } from "./facet/token/standardToken/IStandardTokenSetterFacet.sol";
import { IRouterFacet } from "./facet/router/IRouterFacet.sol";

interface ISentinel is
    /***/IBase,
    /***/IAuthFacet,
    /***/ITokenFacet,
    /***/ITokenMintFacet,
    /***/ITokenBurnFacet,
    /***/ITokenSetterFacet,
    /***/IRouterFacet
    {}