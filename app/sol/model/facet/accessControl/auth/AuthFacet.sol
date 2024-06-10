// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IFacet } from "../../../../IFacet.sol";
import { IAuthFacet } from "./IAuthFacet.sol";
import { EnumerableSet } from "../../../../import/openzeppelin/utils/structs/EnumerableSet.sol";
import { AuthSdk } from "./AuthSdk.sol";

contract AuthFacet is
    IFacet,
    IAuthFacet,
    AuthSdk {
    using EnumerableSet for EnumerableSet.AddressSet;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](6);
        selectors[0] = bytes4(keccak256("membersOf(string,uint256)"));
        selectors[1] = bytes4(keccak256("membersLengthOf(string)"));
        selectors[2] = bytes4(keccak256("hasRole(address,string)"));
        selectors[3] = bytes4(keccak256("hasRole(string)"));
        selectors[4] = bytes4(keccak256("claimOwnership()"));
        selectors[5] = bytes4(keccak256("transferRole(address,address,string)"));
        return selectors;
    }

    function membersOf(string memory role, uint256 key) external view returns (address) {
        return _membersOf(role, k);
    }

    function membersLengthOf(string memory role) external view returns (uint256) {
        return _membersLengthOf(role);
    }

    function hasRole(address account, string memory role) external view returns (bool) {
        return _hasRole(account, role);
    }

    function hasRole(string memory role) external view returns (bool) {
        return _hasRole(role);
    }

    function claimOwnership() external returns (bool) {
        return _claimOwnership();
    }

    function grantRole(address account, string memory role) external onlyOwner("*") returns (bool) {
        _transferRole(address(0), account, role);
        return true;
    }

    function revokeRole(address account, string memory role) external onlyOwner("*") returns (bool) {
        _transferRole(account, address(0), role);
        return true;
    }
}