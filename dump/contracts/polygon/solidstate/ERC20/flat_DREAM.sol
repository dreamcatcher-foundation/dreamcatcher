
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\contracts\polygon\solidstate\ERC20\DREAM.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.0;
////import "contracts/polygon/solidstate/ERC20/Token.sol";

interface IDREAM is IToken {}

contract DREAM is Token {
    constructor() Token("Dream", "DREAM", 200000000) {}
}
