// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "@eth-infinitism/account-abstraction/contracts/core/EntryPoint.sol";
import "@eth-infinitism/account-abstraction/contracts/samples/SimpleWallet.sol";
import "@eth-infinitism/account-abstraction/contracts/samples/SimpleWalletDeployer.sol";
import "@eth-infinitism/account-abstraction/contracts/interfaces/ICreate2Deployer.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MasterOfPaymasterTest is Test {
    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    EntryPoint entryPoint;
    SimpleWalletDeployer walletDeployer;

    SimpleWallet wallet;

    receive() external payable {}

    function setUp() public {
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
            callGasLimit: 4000_000,
            verificationGasLimit: 4000_000,
            preVerificationGas: 4000_000,
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

        uint256 balanceBefore = address(wallet).balance;
        entryPoint.handleOps(ops, payable(address(this)));
        uint256 balanceAfter = address(wallet).balance;
        
        assertTrue(balanceAfter < balanceBefore);
    }

    function revertWithSenderAddressExternal(bytes memory initCode) external {
        vm.prank(address(0));
        address senderAddress = entryPoint.getSenderAddress(initCode);
        assembly {
            mstore(0, senderAddress)
            revert(0, 0x20)
        }
    }

    function hashExternal(UserOperation calldata userOp) external view returns (bytes32) {
        return getRequestId(userOp).toEthSignedMessageHash();
    }

    function getRequestId(UserOperation calldata userOp) public view returns (bytes32) {
        return keccak256(abi.encode(userOp.hash(), entryPoint, block.chainid));
    }

    function _getSenderAddress(bytes memory initCode) internal returns (address) {
        (, bytes memory data) = address(this).call(abi.encodeCall(this.revertWithSenderAddressExternal, (initCode)));
        return abi.decode(data, (address));
    }

    function _joinSignature(uint8 v, bytes32 r, bytes32 s) internal pure returns (bytes memory) {
        return abi.encodePacked(r, s, v);
    }

    function _getInitCode(address owner, uint256 salt) internal view returns (bytes memory) {
        return abi.encodePacked(
            address(walletDeployer), abi.encodeCall(walletDeployer.deployWallet, (entryPoint, owner, salt))
        );
    }
}
