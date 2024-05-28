// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;
import "./ClientFactorySocket.sol";
import "../../../IFacet.sol";

interface IClientFactoryFacet {
    function deploy(string memory daoId) external returns (address);
    function installOn(string memory daoId, string memory facetId) external returns (bool);
    function uninstallFrom(string memory daoId, string memory facetId) external returns (bool);
}

contract ClientFactoryFacet is IFacet, ClientFactorySocket {
    function selectors() external pure returns (bytes4[] memory) {
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = bytes4(keccak256("deploy(string)"));
        selectors[1] = bytes4(keccak256("installOn(string,string)"));
        selectors[2] = bytes4(keccak256("uninstallFrom(string,string)"));
    }

    function deploy(string memory daoId) external returns (address) {
        _deploy(daoId);
    }

    function installOn(string memory daoId, string memory facetId) external returns (bool) {
        return _installOn(daoId, facetId);
    }

    function uninstallFrom(string memory daoId, string memory facetId) external returns (bool) {
        return _uninstallFrom(daoId, facetId);
    }
}