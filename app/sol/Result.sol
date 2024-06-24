// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.19;

struct Result {
    bool ok;
    string code;
}

function Ok() pure returns (Result memory r) {
    r.ok = true;
    return r;
}

function Err(string memory code) pure returns (Result memory r) {
    r.code = code;
    return r;
}

library ResultLib {
    using ResultLib for Result;

    function eq(Result memory self, string memory code) internal pure returns (bool) {
        return _match(self.code, code);
    }

    function tryPanic(Result memory self) internal pure {
        if (!self.ok) {
            _panic(self);
        }
    }

    function panic(Result memory self) internal pure {
        _panic(self);
    }

    function _panic(Result memory self) private pure {
        revert(self.code);
    }

    function _match(string memory a, string memory b) private pure returns (bool) {
        return bytes(a).length == bytes(b).length && keccak256(bytes(a)) == keccak256(bytes(b));
    }
}