

library O {
    struct Ownable {
        address _owner;
    }

    function owner(Ownable storage ownable) internal view returns (address) {
        return ownable._owner;
    }

    function setOwner(Ownable storage ownable, address owner) internal returns (bool) {
        ownable._owner = owner;
    }
}

ownable().setOwner();