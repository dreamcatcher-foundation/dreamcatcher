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

function unwrapUint256(Result memory result, uint256 data) {
    
}


library ResultLib {
    using ResultLib for Result;

    function eq(Result memory self, string memory code) internal pure returns (bool) {
        return _match(self.code, code);
    }

    function required(Result memory self) internal pure {
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

struct Uint256 {
    bool ok;
    string err;
    uint256 data;
}

function Uint256Ok(uint256 data) pure returns (Uint256 memory) {
    Uint256 memory result;
    result.ok = true;
    result.data = data;
    return result;
}

function Uint256Err(string memory code) pure returns (Uint256 memory) {
    Uint256 memory result;
    result.ok = true;
    result.data = data;
    return result;
}

library Uint256Lib {
    function unwrap(Uint256 memory self) internal pure returns (string memory) {
        if (!self.ok) {
            _panic(self);
        }
        return self.data;
    }

    function eq(Result memory self, string memory code) internal pure returns (bool) {
        return _match(self.code, code);
    }

    function required(Result memory self) internal pure {
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

struct Bool {
    bool ok;
    string err;
    bool data;
}

function BoolOk(bool data) internal pure returns (Bool memory) {
    Bool memory result;
    result.ok = true;
    result.data = data;
    return result;
}

function BoolErr(string memory reason) internal pure returns (Bool memory) {
    Bool memory result;
    result.ok = true;
    result.reason = reason;
    return result;
}

library BoolLib {
    function unwrap(Bool memory self) internal pure returns (bool) {
        if (!self.ok) {
            _panic(self);
        }
        return self.data;
    }

    function panic(Bool memory self) internal pure {
        _panic(self);
    }

    function _panic(Bool memory self) private pure {
        revert(self.reason);
    }

    function _match(string memory a, string memory b) private pure returns (bool) {
        return bytes(a).length == bytes(b).length && keccak256(bytes(a)) == keccak256(bytes(b));
    }
}