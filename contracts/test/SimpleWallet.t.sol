// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "@eth-infinitism/account-abstraction/contracts/core/EntryPoint.sol";
import "@eth-infinitism/account-abstraction/contracts/samples/SimpleWallet.sol";
import "@eth-infinitism/account-abstraction/contracts/samples/SimpleWalletDeployer.sol";
import "@eth-infinitism/account-abstraction/contracts/interfaces/ICreate2Deployer.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./AccountAbstractionBase.t.sol";

contract SimpleWalletTest is AccountAbstractionBaseTest {
    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    SimpleWalletDeployer walletDeployer;
    SimpleWallet wallet;

    function setUp() public virtual override {
        super.setUp();
        entryPoint = new EntryPoint({
            _paymasterStake: 1 ether,
            _unstakeDelaySec: 1 minutes
        });
        walletDeployer = new SimpleWalletDeployer();

        wallet = SimpleWallet(payable(_getSenderAddress({initCode: _getInitCode({owner: vm.addr(1), salt: 0})})));

        payable(address(wallet)).transfer(100 ether);
    }

    // charges gas fees from wallet
    function testSampleTx() public {
        bytes memory initCode = _getInitCode({owner: vm.addr(1), salt: 0});

        address sender = _getSenderAddress(initCode);

        UserOperation memory op = UserOperation({
            sender: sender,
            nonce: 0,
            initCode: initCode,
            callData: hex"",
            callGasLimit: 4_000_000,
            verificationGasLimit: 4_000_000,
            preVerificationGas: 4_000_000,
            maxFeePerGas: 100 gwei,
            maxPriorityFeePerGas: 100 gwei,
            paymasterAndData: hex"",
            signature: hex""
        });

        bytes32 opHash = this.hashExternal(op);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, opHash);
        op.signature = _joinSignature(v, r, s);

        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;

        uint256 walletBalanceBefore = address(wallet).balance;
        entryPoint.handleOps(ops, payable(address(this)));
        uint256 walletBalanceAfter = address(wallet).balance;

        assertTrue(walletBalanceAfter < walletBalanceBefore, "wallet balance should decrease");
    }

    function _getInitCode(address owner, uint256 salt) internal view virtual returns (bytes memory) {
        return abi.encodePacked(
            address(walletDeployer), abi.encodeCall(walletDeployer.deployWallet, (entryPoint, owner, salt))
        );
    }
}
