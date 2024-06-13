// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../../../../IFacet.sol";
import { IAuthFacet } from "./IAuthFacet.sol";
import { EnumerableSet } from "../../../import/openzeppelin/utils/structs/EnumerableSet.sol";
import { AuthLib } from "./AuthLib.sol";
import { Auth } from "./Auth.sol";

contract AuthFacet is IFacet, IAuthFacet {
    using EnumerableSet for EnumerableSet.AddressSet;
    using AuthLib for Auth;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](7);
        selectors[0] = bytes4(keccak256("membersOf(string,uint256)"));
        selectors[1] = bytes4(keccak256("membersOf(string)"));
        selectors[2] = bytes4(keccak256("membersLengthOf(string)"));
        selectors[3] = bytes4(keccak256("hasRole(address,string)"));
        selectors[4] = bytes4(keccak256("hasRole(string)"));
        selectors[5] = bytes4(keccak256("claimOwnership()"));
        selectors[6] = bytes4(keccak256("transferRole(address,address,string)"));
        return selectors;
    }

    function auth__members(string memory role, uint256 key) external view returns (address) {
        return _auth().membersOf(role, key);
    }

    function membersOf(string memory role) external view returns (address[] memory) {
        return _auth().membersOf(role);
    }

    function membersLengthOf(string memory role) external view returns (uint256) {
        return _auth().membersLengthOf(role);
    }

    function hasRole(address account, string memory role) external view returns (bool) {
        return _auth().hasRole(account, role);
    }

    function hasRole(string memory role) external view returns (bool) {
        return _auth().hasRole(role);
    }

    function claimOwnership() external returns (bool) {
        _auth().claimOwnership();
        return true;
    }

    function grantRole(address account, string memory role) external returns (bool) {
        _auth().onlyRole("*");
        _auth().grantRole(account, role);
        return true;
    }

    function revokeRole(address account, string memory role) external returns (bool) {
        _auth().onlyRole("*");
        _auth().revokeRole(account, role);
        return true;
    }
}