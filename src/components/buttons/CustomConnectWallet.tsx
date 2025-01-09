"use client";

import React, { useState, useContext } from "react";
import { Button } from "@/components";
import { WalletContext } from "@/context/WalletContext";

interface CustomConnectWalletButtonProps {
  cta: {
    title: string;
  };
}

const CustomConnectWalletButton: React.FC<CustomConnectWalletButtonProps> = ({ cta }) => {
  const [hover, setHover] = useState<boolean>(false);
  const { userAddress, connectWallet, disconnectWallet } = useContext(WalletContext);

  const handleButtonClick = async () => {
    if (userAddress) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  return (
    <Button
      type="button"
      onClick={handleButtonClick}
      size="sm"
      center
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {userAddress
        ? hover
          ? "Disconnect Wallet"
          : `${userAddress.slice(0, 6)}...${userAddress.slice(-5)}`
        : cta.title}
    </Button>
  );
};

export default CustomConnectWalletButton;
