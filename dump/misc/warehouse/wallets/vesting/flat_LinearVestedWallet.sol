
/** 
 *  SourceUnit: \\wsl.localhost\Ubuntu\home\snqre\git\dreamcatcher\dump\misc\warehouse\wallets\vesting\LinearVestedWallet.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
pragma solidity ^0.8.19;
////import "contracts/deps/openzeppelin/finance/VestingWallet.sol";

contract LinearVestedWallet is VestingWallet {
    constructor(address beneficiaryAddress, uint64 startTimestamp, uint64 durationSeconds) 
    VestingWallet(beneficiaryAddress, startTimestamp, durationSeconds) payable {}
}
