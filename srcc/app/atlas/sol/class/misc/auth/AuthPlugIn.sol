// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import { IPlugIn } from "../../../IPlugIn.sol";
import { IAuthPlugIn } from "./IAuthPlugIn.sol";
import { EnumerableSet } from "../../../import/openzeppelin/utils/structs/EnumerableSet.sol";
import { AuthSdk } from "./AuthSdk.sol";

contract AuthPlugIn is
    IPlugIn,
    IAuthPlugIn, 
    AuthSdk {
    using EnumerableSet for EnumerableSet.AddressSet;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](7);
        selectors[0] = bytes4(keccak256("membersOf(address,string)"));
        selectors[1] = bytes4(keccak256("membersOf(string)"));
        selectors[2] = bytes4(keccak256("membersLengthOf(string)"));
        selectors[3] = bytes4(keccak256("hasRole(address,string)"));
        selectors[4] = bytes4(keccak256("hasRole(string)"));
        selectors[5] = bytes4(keccak256("claimOwnership()"));
        selectors[6] = bytes4(keccak256("transferRole(address,address,string)"));
        return selectors;
    }

    function membersOf(string memory role, uint256 memberId) external view returns (address) {
        return _membersOf(role, memberId);
    }

    function membersOf(string memory role) external view returns (address[] memory) {
        return _membersOf(role);
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

    function transferRole(address from, address to, string memory role) external returns (bool) {
        return _transferRole(from, to, role);
    }
}