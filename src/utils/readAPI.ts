import axios from "axios";

const HELIUS_RPC = "https://mainnet.helius-rpc.com/?api-key=b941213c-6a24-44da-b1ec-5dda9ab09e4d";

export async function getAsset(assetId: any, rpcUrl = HELIUS_RPC): Promise<any> {
    try {
        const axiosInstance = axios.create({
            baseURL: rpcUrl,
          });
      const response = await axiosInstance.post(rpcUrl, {
        jsonrpc: "2.0",
        method: "getAsset",
        id: "my-id",
        params: {
          id: assetId
        },
      });
      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  }

  
export async function getAssetProof(assetId: any, rpcUrl = HELIUS_RPC): Promise<any> {
    try {
        
        const axiosInstance = axios.create({
            baseURL: rpcUrl,
          });
      const response = await axiosInstance.post(rpcUrl, {
        jsonrpc: "2.0",
        method: "getAssetProof",
        id: "my-id",
        params: {
          id: assetId
        },
      });
      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  }