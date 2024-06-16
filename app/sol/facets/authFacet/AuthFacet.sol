// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../IFacet.sol";
import { IAuthFacet } from "./IAuthFacet.sol";
import { AuthSlLib } from "./AuthSlLib.sol";
import { AuthSlot } from "./AuthSlot.sol";
import { AuthSl } from "./AuthSl.sol";

contract AuthFacet is 
    IFacet,
    IAuthFacet,
    AuthSlot {
    using AuthSlLib for AuthSl;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](8);
        selectors[0] = bytes4(keccak256("members(string,address)"));
        selectors[1] = bytes4(keccak256("members(string)"));
        selectors[2] = bytes4(keccak256("membersCount(string)"));
        selectors[3] = bytes4(keccak256("hasMember(string,address)"));
        selectors[4] = bytes4(keccak256("hasMember(string)"));
        selectors[5] = bytes4(keccak256("claimOwnership()"));
        selectors[6] = bytes4(keccak256("assignRole(string,address)"));
        selectors[7] = bytes4(keccak256("revokeRole(string,address)"));
        return selectors;
    }

    function members(string memory roleId, uint256 i) external view returns (address) {
        return _authSl().members(roleId, i);
    }

    function members(string memory roleId) external view returns (address[] memory) {
        return _authSl().members(roleId);
    }

    function membersCount(string memory roleId) external view returns (uint256) {
        return _authSl().membersCount(roleId);
    }

    function hasMember(string memory roleId, address account) external view returns (bool) {
        return _authSl().hasMember(roleId, account);
    }

    function hasMember(string memory roleId) external view returns (bool) {
        return _authSl().hasMember(roleId);
    }

    function claimOwnership() external returns (bool) {
        return _authSl().claimOwnership();
    }

    function assignRole(string memory roleId, address account) external returns (bool) {
        _authSl().onlyRole("*");
        _authSl().assignRole(roleId, account);
        return true;
    }

    function revokeRole(string memory roleId, address account) external returns (bool) {
        _authSl().onlyRole("*");
        _authSl().revokeRole(roleId, account);
        return true;
    }
}