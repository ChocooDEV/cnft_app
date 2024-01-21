import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Card from "./Card";
import Transfer from "./Transfer";

const url = `@YOUR API KEY`
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

const getMetadata = async (mintAccounts: string[]) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mintAccounts,
      includeOffChain: true,
      disableCache: false,
    }),
  });

  const data = await response.json();
  return data;
};

const searchAssets = async (ownerAddress: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "chocoo1",
      method: "searchAssets",
      params: {
        ownerAddress,
        page: 1,
      },
    }),
  });

  const { result } = await response.json();

  const groupedResults: {
    id: string;
    assets: { id: string; name: string; json_uri: string }[];
  }[] = [];

  for (let i = 0; i < result.items.length; i++) {
    const asset = {
      id: result.items[i].id,
      name: result.items[i].content.metadata.name,
      json_uri: result.items[i].content.json_uri,
      ownership: result.items[i].ownership,
      compression: result.items[i].compression,
      compressed: result.items[i].compression.compressed,
      attributes: result.items[i].content?.metadata?.attributes?.map(
        ({ traitType, trait_type, value }) => ({
          traitType: traitType || trait_type,
          value,
        })
      ) || [],
    };

    const existingGroup = groupedResults.find((group) => group.id === asset.id);
    if (existingGroup) {
      existingGroup.assets.push(asset);
    } else {
      const newGroup = {
        id: asset.id,
        assets: [asset],
      };

      groupedResults.push(newGroup);
    }
  }

  return groupedResults;
};

export const Nft = () => {
  const wallet = useWallet();
  const [data, setData] = useState<any>({ owner: "", assets: [] });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const ownerAddress = wallet.publicKey.toBase58();
      searchAssets(ownerAddress)
        .then(async (groupedResults) => {
          const updatedAssets = [];

          for (const group of groupedResults) {
            const assetsWithMetadata = await Promise.all(
              group.assets.map(async (asset) => {
                const metadataResponse = await fetch(asset.json_uri);
                const metadata = await metadataResponse.json();

                return {
                  ...asset,
                  metadata,
                };
              })
            );

            updatedAssets.push({
              ...group,
              assets: assetsWithMetadata,
            });
          }

          setData({ owner: ownerAddress, assets: updatedAssets });
        })
        .catch((error) => {
          console.error("Error fetching assets:", error);
        });
    }
  }, [wallet]);

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId === selectedCardId ? null : cardId);
  };
  
  const selectedCard = data.assets
    .flatMap((group: any) => group.assets)
    .find((nft: any) => nft.id === selectedCardId);

  return (
    <div className="p-4">
        <h1 className="text-center text-3xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
          cNFTs of <span className="text-white">{data.owner}</span>
        </h1>
        <div className="card-grid">
        {data.assets.map((group: any) =>
          group.assets.map((nft: any) => (
            <div
              key={nft.id}
              className={`card-grid-item ${selectedCardId === nft.id ? "selected" : ""}`}
              onClick={() => handleCardClick(nft.id)}
            >
              <Card nft={nft} />
            </div>
          ))
        )}
      </div>
      <Transfer selectedCard={selectedCard}/>
    </div>
  );
};
