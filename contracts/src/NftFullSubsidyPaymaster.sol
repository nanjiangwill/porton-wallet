// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable reason-string */

import "@eth-infinitism/account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * A paymaster that provides full subsidy if user wallet holds an NFT.
 */
contract NftFullSubsidyPaymaster is BasePaymaster {
    using UserOperationLib for UserOperation;

    mapping(address => bool) public nftWhitelist;

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}

    function addNft(address nftContract) external onlyOwner {
        nftWhitelist[nftContract] = true;
    }

    function removeNft(address nftContract) external onlyOwner {
        nftWhitelist[nftContract] = false;
    }

    /**
     * Verify that the user wallet holds an NFT.
     * the "paymasterAndData" is expected to contain the NFT contract address.
     */
    function validatePaymasterUserOp(UserOperation calldata userOp, bytes32 requestId, uint256 requiredPreFund)
        external
        view
        override
        returns (bytes memory context)
    {
        (requestId, requiredPreFund, context); // avoid warnings

        address nftContract = address(bytes20(userOp.paymasterAndData[20:]));
        require(nftWhitelist[nftContract], "Nft not whitelisted");

        uint256 nftCount = IERC721(nftContract).balanceOf(userOp.sender);
        require(nftCount > 0, "No nfts found at wallet address");
    }
}
