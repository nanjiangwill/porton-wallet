// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "@eth-infinitism/account-abstraction/contracts/core/EntryPoint.sol";
import "@eth-infinitism/account-abstraction/contracts/interfaces/ICreate2Deployer.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AccountAbstractionBaseTest is Test {
    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    EntryPoint entryPoint;

    receive() external payable {}

    function setUp() public virtual {
        entryPoint = new EntryPoint({
            _paymasterStake: 1 ether,
            _unstakeDelaySec: 1 minutes
        });
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

    function getRequestId(UserOperation calldata userOp) public view virtual returns (bytes32) {
        return keccak256(abi.encode(userOp.hash(), entryPoint, block.chainid));
    }

    function _getSenderAddress(bytes memory initCode) internal returns (address) {
        (, bytes memory data) = address(this).call(abi.encodeCall(this.revertWithSenderAddressExternal, (initCode)));
        return abi.decode(data, (address));
    }

    function _joinSignature(uint8 v, bytes32 r, bytes32 s) internal pure returns (bytes memory) {
        return abi.encodePacked(r, s, v);
    }
}
