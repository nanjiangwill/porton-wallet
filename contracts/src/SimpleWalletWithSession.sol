// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable reason-string */

import "@eth-infinitism/account-abstraction/contracts/samples/SimpleWallet.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "forge-std/Test.sol";

uint256 constant SIGNATURE_LENGTH = 65;
uint256 constant ADDRESS_LENGTH = 20;

contract SimpleWalletWithSession is SimpleWallet {
    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    uint96 public sessonExpiry;
    address public sessionAddr; // temporary wallet address

    constructor(IEntryPoint anEntryPoint, address anOwner) SimpleWallet(anEntryPoint, anOwner) {}

    function startSession(address _sessionAddr) external {
        _requireFromEntryPoint();
        sessonExpiry = uint96(block.timestamp + 30 minutes);
        sessionAddr = _sessionAddr;
    }

    function _validateSignature(UserOperation calldata userOp, bytes32 requestId, address) internal virtual override {
        bytes32 hash = requestId.toEthSignedMessageHash();
        address recovered = hash.recover(userOp.signature);

        if (block.timestamp < sessonExpiry) {
            // session ongoing, allow owner and session temporary address
            require(recovered == sessionAddr || recovered == owner, "wallet:a wrong signature");
        } else {
            // session expired, only allow owner
            require(recovered == owner, "wallet:b wrong signature");
        }

        // update session expiry
        sessonExpiry = uint96(block.timestamp + 30 minutes);
    }
}
