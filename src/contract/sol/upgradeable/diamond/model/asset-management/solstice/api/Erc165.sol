// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

abstract contract Erc165 {
    mapping(bytes4 => bool) private _supportsInterface;

    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return _supportsInterface[interfaceId];
    }

    function _setSupportsInterface(bytes4 interfaceId, bool status) internal virtual {
        _supportsInterface[interfaceId] = status;
        return;
    }
}