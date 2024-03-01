// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../client/Diamond.sol";

library DiamondFactoryComponent {
    struct DiamondFactory {
        address[] diamonds;
        uint256 count;
    }

    function diamonds(DiamondFactory storage factory, uint i) internal view returns (address) {
        return _diamonds(factory, i);
    }

    function deploy(DiamondFactory storage diamondFactory) internal returns (bool) {
        Diamond diamond = new Diamond();
        diamondFactory.diamonds.push(address(diamond));
        return true;
    }

    function _diamonds(DiamondFactory storage factory, uint i) private view returns (address) {
        return factory.diamonds[i];
    }
}