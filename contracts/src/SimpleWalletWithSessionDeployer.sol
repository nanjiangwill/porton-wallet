// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import "./SimpleWalletWithSession.sol";

/**
 * a sampler deployer contract for SimpleWallet
 * the "initCode" for a wallet hold its address and a method call (deployWallet) with parameters, not actual constructor code.
 */
contract SimpleWalletWithSessionDeployer {
    function deployWallet(IEntryPoint entryPoint, address owner, uint256 salt)
        public
        returns (SimpleWalletWithSession)
    {
        return new SimpleWalletWithSession{salt : bytes32(salt)}(entryPoint, owner);
    }
}
