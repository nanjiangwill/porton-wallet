// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/NftFullSubsidyPaymaster.sol";

import "./mocks/NftMock.sol";
import "./AccountAbstractionBase.t.sol";

contract NftFullSubsidyPaymasterTest is AccountAbstractionBaseTest {
    NftMock nft;
    NftFullSubsidyPaymaster nftFullSubsidyPaymaster;

    function setUp() public override {
        super.setUp();

        nft = new NftMock("NFT", "NFT");
        nft.mint(address(wallet), 0);

        nftFullSubsidyPaymaster = new NftFullSubsidyPaymaster(entryPoint);
        nftFullSubsidyPaymaster.addNft(address(nft));

        nftFullSubsidyPaymaster.addStake{value: 1 ether}(0);
        nftFullSubsidyPaymaster.deposit{value: 1000 ether}();
    }

    // charges gas fees from paymaster deposit
    function testSubsidizedTx() public {
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
            paymasterAndData: abi.encodePacked(nftFullSubsidyPaymaster, nft),
            signature: hex""
        });

        bytes32 opHash = this.hashExternal(op);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, opHash);
        op.signature = _joinSignature(v, r, s);

        UserOperation[] memory ops = new UserOperation[](1);
        ops[0] = op;

        uint256 walletBalanceBefore = address(wallet).balance;
        uint256 paymasterBalanceBefore = nftFullSubsidyPaymaster.getDeposit();
        entryPoint.handleOps(ops, payable(address(this)));
        uint256 walletBalanceAfter = address(wallet).balance;
        uint256 paymasterBalanceAfter = nftFullSubsidyPaymaster.getDeposit();

        assertEq(walletBalanceAfter, walletBalanceBefore, "wallet balance should stay same");
        assertTrue(paymasterBalanceAfter < paymasterBalanceBefore, "paymaster balance should decrease");
    }
}
