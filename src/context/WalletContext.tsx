'use client'

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { WalletConnectWallet, WalletConnectChainID } from "@tronweb3/walletconnect-tron";
import { TronWeb } from "tronweb";

// Define the shape of the context
interface WalletContextProps {
  wallet: WalletConnectWallet | null;
  userAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

// Create the context with default values
export const WalletContext = createContext<WalletContextProps>({
  wallet: null,
  userAddress: null,
  connectWallet: async () => { },
  disconnectWallet: async () => { },
});

// Provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletConnectWallet | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Initialize WalletConnectWallet
  const walletConnect = new WalletConnectWallet({
    network: WalletConnectChainID.Mainnet,
    options: {
      relayUrl: process.env.NEXT_PUBLIC_APP_RELAY_URL || "wss://relay.walletconnect.com",
      projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID || "",
      metadata: {
        name: "Camell (CAMT)",
        description: "CAMT Wallet Connect",
        url: "https://camt.cloud/",
        icons: [
          "https://camell-web-logo.s3.ap-northeast-2.amazonaws.com/camt-logo.png",
        ],
      },
    },
  });

  // Function to connect the wallet
  const connectWallet = async () => {
    try {
      const { address } = await walletConnect.connect();
      const tronInstance = new TronWeb({
        fullHost: process.env.NEXT_PUBLIC_TRON_HOST_LINK || "https://api.trongrid.io",
      });
      tronInstance.setAddress(address);
      setWallet(walletConnect);
      setUserAddress(address);
      console.log("Wallet connected:", address);
      alert(`Wallet connected successfully!\nAddress: ${address}`);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Error connecting wallet. Please try again.");
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setWallet(null);
        setUserAddress(null);
        console.log("Wallet disconnected.");
        alert("Wallet disconnected successfully.");
      } else {
        console.warn("No wallet instance found to disconnect.");
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      alert("Error disconnecting wallet. Please try again.");
    }
  };


  return (
    <WalletContext.Provider value={{ wallet, userAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
