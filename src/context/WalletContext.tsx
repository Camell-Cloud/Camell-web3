'use client'
import React, { createContext, useState, useContext } from "react";

interface WalletContextType {
  userAddress: string | null;
  setUserAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

const WalletContext = createContext<WalletContextType>({
  userAddress: null,
  setUserAddress: () => { },
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  return (
    <WalletContext.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);