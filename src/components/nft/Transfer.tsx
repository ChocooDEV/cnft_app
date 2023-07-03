import React, { useState } from "react";
import { createTransferInstruction, PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";
import { AccountMeta, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, SPL_NOOP_PROGRAM_ID } from "@solana/spl-account-compression";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as bs58 from "bs58";
import { notify } from "utils/notifications";
import { getAsset, getAssetProof } from "utils/readAPI";

const Transfer = ({ selectedCard }) => {
 
  const [recipientAddress, setRecipientAddress] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleTransfer = async () => {
    const merkleTree =  new PublicKey(selectedCard.compression.tree);

    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
      [merkleTree.toBuffer()],
      BUBBLEGUM_PROGRAM_ID,
    );

    const assetId = selectedCard.id;
    const res = await getAsset(assetId);
    const proof = await getAssetProof(assetId);
    const proofPathAsAccounts = mapProof(proof);

    console.log(selectedCard.ownership.delegate)
    console.log(selectedCard.compression.tree)
    console.log(selectedCard.id)
    console.log(proof.root)
    console.log(merkleTree)

    const ix = await createTransferInstruction(
      {
        treeAuthority: treeAuthority,
        leafOwner:  new PublicKey(publicKey),
        leafDelegate:  new PublicKey(selectedCard.ownership.delegate),
        newLeafOwner: new PublicKey(recipientAddress),
        merkleTree: merkleTree,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        anchorRemainingAccounts: proofPathAsAccounts
      },
      {
        creatorHash: decode(res.compression.creator_hash),
        dataHash: decode(res.compression.data_hash),
        index: res.compression.leaf_id,
        nonce: res.compression.leaf_id,
        root: decode(proof.root)
      }
    );

    let latestBlockhash = await connection.getLatestBlockhash();

    const messageLegacy = new TransactionMessage({
        instructions: [ix],
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
    }).compileToLegacyMessage();

    const transaction = new VersionedTransaction(messageLegacy)
    const signature = await sendTransaction(transaction, connection);

    notify({ type: 'success', message: 'Tip transaction successful!', txid: signature });

    // Reset the input field
    setRecipientAddress("");
  };

  const mapProof = (assetProof: { proof: string[] }): AccountMeta[] => {
    if (!assetProof.proof || assetProof.proof.length === 0) {
      throw new Error("Proof is empty");
    }
    return assetProof.proof.map((node) => ({
      pubkey: new PublicKey(node),
      isSigner: false,
      isWritable: false,
    }));
  };

  const decode = (stuff) => {
    return bufferToArray(bs58.decode(stuff));
  };

  const bufferToArray = (buffer) => {
    const nums = [];
    for (let i = 0; i < buffer.length; i++) {
      nums.push(buffer[i]);
    }
    return nums;
  };

  return (
    <div>
      <h1 className="text-center text-3xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
        Transfer <span className="text-white">cNFTs</span>
      </h1>
      {selectedCard ? (
        <div>
          <p className="text-lg font-semibold text-white-700 mb-2">Selected cNFT: {selectedCard.name}</p>
          <div className="flex flex-col mb-4">
            <label htmlFor="recipient-address" className="text-white-700 mb-1">Recipient Address:</label>
            <input
              id="recipient-address"
              type="text"
              value={recipientAddress}
              onChange={handleAddressChange}
              className="border border-gray-300 rounded py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleTransfer}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Transfer;
