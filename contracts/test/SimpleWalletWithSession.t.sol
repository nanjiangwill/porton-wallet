// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/SimpleWalletWithSessionDeployer.sol";

import "./AccountAbstractionBase.t.sol";

contract SimpleWalletWithSessionTest is AccountAbstractionBaseTest {
    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    SimpleWalletWithSessionDeployer walletDeployer2;
    SimpleWalletWithSession wallet2;

    function setUp() public virtual override {
        entryPoint = new EntryPoint({
            _paymasterStake: 1 ether,
            _unstakeDelaySec: 1 minutes
        });
        walletDeployer2 = new SimpleWalletWithSessionDeployer();

        wallet2 =
            SimpleWalletWithSession(payable(_getSenderAddress({initCode: _getInitCode({owner: vm.addr(1), salt: 0})})));

        payable(address(wallet2)).transfer(100 ether);
    }

    // owner is able to create a session
    function testOwnerCreatesSession() public {
        bytes memory initCode = _getInitCode({owner: vm.addr(1), salt: 0});

        address sender = _getSenderAddress(initCode);
        {
            UserOperation memory op = UserOperation({
                sender: sender,
                nonce: 0,
                initCode: _getInitCode({owner: vm.addr(1), salt: 0}),
                callData: abi.encodeCall(SimpleWalletWithSession.startSession, (vm.addr(2))), // starts session for vm.addr(2)
                callGasLimit: 4_000_000,
                verificationGasLimit: 4_000_000,
                preVerificationGas: 4_000_000,
                maxFeePerGas: 100 gwei,
                maxPriorityFeePerGas: 100 gwei,
                paymasterAndData: hex"",
                signature: hex""
            });

            bytes32 opHash = this.hashExternal(op);
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, opHash); // signed by owner
            op.signature = _joinSignature(v, r, s);

            UserOperation[] memory ops = new UserOperation[](1);
            ops[0] = op;

            entryPoint.handleOps(ops, payable(address(this)));
        }

        assertEq(wallet2.sessionAddr(), vm.addr(2));

        // session wallet tries to send txs
        {
            UserOperation memory op = UserOperation({
                sender: sender,
                nonce: 0,
                initCode: hex"",
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
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(2, opHash); // signed by session wallet
            op.signature = _joinSignature(v, r, s);

            UserOperation[] memory ops = new UserOperation[](1);
            ops[0] = op;

            entryPoint.handleOps(ops, payable(address(this)));
        }
    }

    function _getInitCode(address owner, uint256 salt) internal view virtual returns (bytes memory) {
        return abi.encodePacked(
            address(walletDeployer2), abi.encodeCall(walletDeployer2.deployWallet, (entryPoint, owner, salt))
        );
    }
}
