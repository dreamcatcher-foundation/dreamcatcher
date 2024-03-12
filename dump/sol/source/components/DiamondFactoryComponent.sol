// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Client} from "../../dist/Client.sol";


library ClientFactoryComponent {
    
    struct ClientFactory {
        Client[] clients;
        mapping(string => address) plugIns;
    }



    function plugIns(string name) internal view {
        plugIns(name);
    }

    function buildClient(ClientFactory storage factory, address controller) internal returns (uint256) {
        Client newClient = new Client();
        factory.clients.push(newClient);
        return factory.clients.length - 1;
    }

    function install(ClientFactory storage factory) internal {

    }

    function uninstall(ClientFactory storage factory) internal {

    }
    

    /**
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
    */
}