import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components";
import { WalletConnectWallet, WalletConnectChainID } from "@tronweb3/walletconnect-tron";

interface CustomConnectWalletButtonProps {
  cta: {
    title: string;
  };
}

const CustomConnectWalletButton: React.FC<CustomConnectWalletButtonProps> = ({ cta }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [hover, setHover] = useState<boolean>(false);
  const walletRef = useRef<WalletConnectWallet | null>(null);

  const connectWallet = async () => {
    try {
      walletRef.current = new WalletConnectWallet({
        network: WalletConnectChainID.Mainnet,
        options: {
          relayUrl: process.env.NEXT_PUBLIC_APP_RELAY_URL || "wss://relay.walletconnect.com",
          projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID || "",
          metadata: {
            name: "Camell (CAMT)",
            description: "CAMT Wallet Connect",
            url: "https://camt.cloud/",
            icons: ["https://camell-web-logo.s3.ap-northeast-2.amazonaws.com/camt-logo.png"],
          },
        },
        web3ModalConfig: {
          themeMode: "dark",
          themeVariables: {
            "--wcm-z-index": "1000",
          },
          explorerRecommendedWalletIds: [
            "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
            "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
          ],
        },
      });

      const { address: connectedAddress } = await walletRef.current.connect();
      const formattedAddress = `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-5)}`;
      setAddress(formattedAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (walletRef.current) {
        await walletRef.current.disconnect();
        walletRef.current = null;
        setAddress(null);
      } else {
        console.warn("No wallet instance found.");
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  useEffect(() => {
  }, []);

  return (
    <Button
      type="button"
      onClick={address ? disconnectWallet : connectWallet}
      size="sm"
      center
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {address ? (hover ? "Disconnect Wallet" : `${address}`) : cta.title}
    </Button>
  );
};

export default CustomConnectWalletButton;
