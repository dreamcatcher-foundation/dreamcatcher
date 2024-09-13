// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

/// version control
/// roles to set certain keys for each role
/// everything has a unique id on the router as a lookup system
/// and owners of that id can change the router address of their
/// application
contract Router {
    event UuidMinted();

    mapping(bytes32 => bytes32[]) private _children;
    
    uint256 count;



    function isChild() public {

    }

    function getUuid() public {

    }

    function get(bytes32 key) public returns (address) {

    }

    function set(bytes32 key, address implementation) public {

    }

    function _generateKey(bytes32 prefix) private returns (bytes32) {
        return keccak256(bytes(abi.encodePacked(prefix, count++)));
    }

    function _issueKey(string memory name)
}

contract Child {

    IRouter private _routerI;

    function s() public virtual {
        IToken(_routerI.get(keccak256(bytes("native-token")))).name();

    }
}