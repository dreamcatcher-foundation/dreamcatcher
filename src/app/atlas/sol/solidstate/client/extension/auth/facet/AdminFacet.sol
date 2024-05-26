// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "../../../../../import/openzeppelin/utils/structs/EnumerableSet.sol";
import "../slot/AdminSlot.sol";
import "../socket/AdminSocket.sol";

contract AdminFacet is AdminSlot, AdminSocket {
    using EnumerableSet for EnumerableSet.AddressSet;

    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](5);
        selectors[0] = bytes4(keccak256("membersOf(bytes32)"));
        selectors[1] = bytes4(keccak256("hasRole(address,bytes32)"));
        selectors[2] = bytes4(keccak256("hasRole(bytes32)"));
        selectors[3] = bytes4(keccak256("claimOwnership()"));
        selectors[4] = bytes4(keccak256("transferRole(address,address,bytes32)"));
        return selectors;
    }

    function membersOf(bytes32 memory role) external view returns (address[] memory) {
        return _membersOf()[role].values();
    }

    function hasRole(address account, bytes32 role) external view returns (bool) {
        return _hasRole(account, role);
    }

    function hasRole(bytes32 role) external view returns (bool) {
        return _hasRole(role);
    }

    function claimOwnership() external returns (bool) {
        _claimOwnership();
        return true;
    }

    function transferRole(address from, address to, bytes32 role) external returns (bool) {
        bytes32 ownerRole = keccak256("owner");
        _onlyRole(ownerRole);
        _transferRole(from, to, role);
        return true;
    }
}