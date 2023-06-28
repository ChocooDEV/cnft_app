import { FC, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Nft } from '../../components/nft/Nft';
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col w-full">
        <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          Send cNFTs
        </h1>
        {wallet.connected && (
          <div className="flex flex-col mt-2 testWidth">
            <Nft />
            <h4 className="md:w-full text-2xl text-slate-300 my-2">
              <div className="flex flex-row justify-center">
                <div>{(balance || 0).toLocaleString()}</div>
                <div className="text-slate-600 ml-2">SOL</div>
              </div>
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};
