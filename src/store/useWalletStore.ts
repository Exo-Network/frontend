import { create } from "zustand";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

interface WalletState {
  walletAddress: string | null;
  balance: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  getBalance: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  walletAddress: null,
  balance: null,

  connectWallet: async () => {
    const { solana } = window as any;
    if (solana && solana.isPhantom) {
      try {
        const response = await solana.connect();
        const address = response.publicKey.toString();
        set({ walletAddress: address });
        await get().getBalance();
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    }
  },

  getBalance: async () => {
    const { walletAddress } = get();
    if (walletAddress) {
      try {
        const connection = new Connection(clusterApiUrl("mainnet-beta"));
        const balance = await connection.getBalance(new PublicKey(walletAddress));
        set({ balance: balance / 1e9 }); // Convert lamports to SOL
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    }
  },

  disconnectWallet: () => {
    const { solana } = window as any;
    if (solana && solana.isPhantom) {
      solana.disconnect();
      set({ walletAddress: null, balance: null });
    }
  }
}));
