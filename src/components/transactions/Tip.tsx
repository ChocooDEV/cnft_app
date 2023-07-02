import { FC, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    SystemProgram,
    Connection,
    Keypair,
    PublicKey,
    Signer,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";import { notify } from "../../utils/notifications";

const Tip: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [amount, setAmount] = useState(0);

  const handleTipTransaction = async (tipAmount: number) => {
    if (!publicKey) {
      notify({ type: 'error', message: 'Wallet not connected!' });
      return;
    }

    try {
     console.log(publicKey)
      const lamports = Math.round(tipAmount * 1_000_000_000); // Convert SOL to lamports
      const recipientAddress = '2KpZh4GnpgKKuXkTdrdgDiUhmr86udo8jSPN6dRLWkYn';

      const instructions = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(recipientAddress),
        lamports,
      });

      let latestBlockhash = await connection.getLatestBlockhash();
      const messageLegacy = new TransactionMessage({
          instructions: [instructions],
          payerKey: publicKey,
          recentBlockhash: latestBlockhash.blockhash,
      }).compileToLegacyMessage();
      const transaction = new VersionedTransaction(messageLegacy);

      const signature = await sendTransaction(transaction, connection);

      notify({ type: 'success', message: 'Tip transaction successful!', txid: signature });
    } catch (error: any) {
      notify({ type: 'error', message: 'Tip transaction failed!', description: error.message });
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setAmount(value);
  };

  return (
    <div className="tip-container">
      <div className="button-container">
        <button onClick={() => setAmount(0.1)}>0.1 SOL</button>
        <button onClick={() => setAmount(0.25)}>0.25 SOL</button>
        <button onClick={() => setAmount(0.5)}>0.5 SOL</button>
        <button onClick={() => setAmount(1)}>1 SOL</button>
      </div>
      <div className="input-container">
        <input
          className="tip-input"
          type="number"
          step="0.1"
          min="0.1"
          value={amount}
          onChange={handleAmountChange}
        />
        <button className="tip-button" onClick={() => handleTipTransaction(amount)}>
          Send Tip
        </button>
      </div>
    </div>
  );
};

export default Tip;
