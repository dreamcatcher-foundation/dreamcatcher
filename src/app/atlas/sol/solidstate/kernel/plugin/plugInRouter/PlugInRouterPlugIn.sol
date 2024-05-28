// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./PlugInRouterSocket.sol";
import "../auth/AuthSocket.sol";

interface IPlugInRouterPlugIn {
    function versionsOf(string memory plugInId, uint256 version) external view returns (address);
    function versionsOf(string memory plugInId) external view returns (address[] memory);
    function versionsLengthOf(string memory plugInId) external view returns (uint256);
    function latestVersionOf(string memory plugInId) external view returns (address);
    function commit(string memory plugInId, address plugIn) external returns (bool);
}

contract PlugInRouterPlugIn is PlugInRouterSocket {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](5);
        selectors[0] = bytes4(keccak256("versionsOf(string,uint256)"));
        selectors[1] = bytes4(keccak256("versionsOf(string)"));
        selectors[2] = bytes4(keccak256("versionsLengthOf(string)"));
        selectors[3] = bytes4(keccak256("latestVersionOf(string)"));
        selectors[4] = bytes4(keccak256("commit(string,address)"));
        return selectors;
    }

    function versionsOf(string memory plugInId, uint256 version) external view returns (address) {
        return _versionsOf(plugInId, version);
    }

    function versionsOf(string memory plugInId) external view returns (address[] memory) {
        return _versionsOf(plugInId);
    }

    function versionsLengthOf(string memory plugInId) external view returns (uint256) {
        return _versionsLengthOf(plugInId);
    }

    function latestVersionOf(string memory plugInId) external view returns (address) {
        return _latestVersionOf(plugInId);
    }

    function commit(string memory plugInId, address plugIn) internal returns (bool) {
        _onlyRole("owner");
        return _commit(plugInId, plugIn);
    }
}