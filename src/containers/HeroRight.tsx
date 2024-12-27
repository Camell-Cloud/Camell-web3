"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components";
import { slideUp } from "@/styles/animations";
import { currencies } from "@/lib/content/cryptos";
import { useWallet } from "@/context/WalletContext";

const CONTRACT_ADDRESS = "TJ75ePmDwPRHRmc7F5853Pr6oDoy6YSzdh";

interface HeroRightSectionProps {
  getAnimationDelay: (i: number, increment?: number) => number;
}

const HeroRightSection: React.FC<HeroRightSectionProps> = ({
  getAnimationDelay,
}) => {
  const [inputCurrency, setInputCurrency] = useState("TRON");
  const [outputCurrency, setOutputCurrency] = useState("CAMT");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [tronPrice, setTronPrice] = useState(0);
  const [usdtPrice, setUsdtPrice] = useState(0);
  const [camtPrice, setCamtPrice] = useState(0);
  const { userAddress } = useWallet();

  const fetchPrice = async (symbol: string) => {
    const res = await fetch(`/api/quotes?symbol=${symbol}`);
    const data = await res.json();
    return data?.data?.[symbol]?.quote?.USD?.price || 0;
  };

  useEffect(() => {
    const loadPrices = async () => {
      const [tron, usdt, camt] = await Promise.all([
        fetchPrice("TRX"),
        fetchPrice("USDT"),
        fetchPrice("CAMT"),
      ]);
      setTronPrice(tron);
      setUsdtPrice(usdt);
      setCamtPrice(camt);
    };
    loadPrices();
  }, []);

  // --- Only allow numeric and dot input in fields ------------------------
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedChars = /[0-9.]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  // --- Handle input and output changes -----------------------------------
  const handleInputChange = (value: string) => {
    setInputAmount(value);
    if (!value) {
      setOutputAmount("");
      return;
    }
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    let fromPrice = 0;
    if (inputCurrency === "TRON") fromPrice = tronPrice;
    else if (inputCurrency === "USDT") fromPrice = usdtPrice;

    const out = (numericValue * fromPrice) / camtPrice; // e.g. TRX -> CAMT
    setOutputAmount(out.toFixed(6));
  };

  const handleOutputChange = (value: string) => {
    setOutputAmount(value);
    if (!value) {
      setInputAmount("");
      return;
    }
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    let fromPrice = 0;
    if (inputCurrency === "TRON") fromPrice = tronPrice;
    else if (inputCurrency === "USDT") fromPrice = usdtPrice;

    // Reverse calculation: CAMT -> TRX or USDT
    const fromValue = (numericValue * camtPrice) / fromPrice;
    setInputAmount(fromValue.toFixed(6));
  };

  // --- TronLink-based "Claim" function -----------------------------------
  const handleClaim = async () => {
    if (!window || !window.tronWeb) {
      alert("Please install or unlock TronLink to continue.");
      return;
    }

    if (!userAddress) {
      alert("Please unlock TronLink or select an account.");
      return;
    }

    if (!inputAmount) {
      alert("Please enter an amount first!");
      return;
    }

    try {
      if (!window.tronWeb) {
        alert("TronWeb not found. Ensure your wallet is properly connected.");
        return;
      }

      const tronWeb = window.tronWeb;

      // 1) Send TRX to your contract address
      const trxTx = await tronWeb.trx.sendTransaction(
        CONTRACT_ADDRESS,
        tronWeb.toSun(inputAmount)
      );
      console.log("TRX Sent:", trxTx);

      // 2) Then call your contract’s transfer/buy method to give user CAMT
      const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);

      const tokenAmount = parseFloat(inputAmount);
      const camtTx = await contract.transfer(userAddress, tokenAmount).send();
      console.log("CAMT Sent:", camtTx);
      alert("Transaction successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  // --- Example second button (Claim & Stake, etc.) -----------------------
  const handleClaimAndStake = () => {
    console.log("Check Swap / Stake logic here...");
  };

  // --- Filtering currencies (TRON, USDT -> CAMT) -------------------------
  const fromCurrencies = currencies.filter(
    (currency) => currency.value === "TRON" || currency.value === "USDT"
  );
  const toCurrencies = currencies.filter((currency) => currency.value === "CAMT");
  const inputCurrencyData = fromCurrencies.find((c) => c.value === inputCurrency);
  const outputCurrencyData = toCurrencies.find((c) => c.value === outputCurrency);

  // --- Render UI ---------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6">
      <motion.div
        variants={slideUp({ delay: getAnimationDelay(3) })}
        initial="hidden"
        animate="show"
        className="w-[490px] h-auto flex flex-col items-center rounded-lg border-2 border-pink-300 dark:border-white bg-opacity-50 backdrop-blur-lg p-6"
        style={{ background: "rgba(255, 255, 255, 0.1)" }}
      >
        <h1 className="text-4xl mt-2 mb-7 font-bold tracking-tighter text-pink-500 dark:text-pink-300">
          BUY CAMT NOW
        </h1>

        <div
          id="exchangeWidget"
          className="p-8 rounded-lg border-2 border-pink-300 dark:border-white bg-opacity-50 backdrop-blur-lg flex flex-col gap-6"
        >
          {/* Input field */}
          <div className="relative flex items-center gap-x-2">
            <input
              id="inputAmount"
              type="text"
              className="w-full py-2 px-2 rounded border border-pink-300 dark:border-white bg-white/80 focus:outline-none text-gray-800"
              placeholder="Enter amount"
              onKeyPress={handleKeyPress}
              value={inputAmount}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <select
              className="w-32 py-2 px-2 rounded border border-pink-300 dark:border-white bg-pink-200 hover:bg-pink-300 text-white font-bold focus:outline-none"
              style={{
                backgroundImage: `url(${inputCurrencyData?.imgSrc})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "5px 50%",
                backgroundSize: "30px",
                paddingLeft: "2.4rem",
                paddingRight: "1rem",
              }}
              value={inputCurrency}
              onChange={(e) => setInputCurrency(e.target.value)}
            >
              {fromCurrencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          {/* Arrow or Divider */}
          <div className="flex items-center justify-center">
            <svg
              width="30"
              height="30"
              fill="#000000"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon line mx-4 transform rotate-90"
            >
              <polyline
                points="4 14 20 14 17 17"
                style={{
                  fill: "none",
                  stroke: "#ffffff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 1.5,
                }}
              />
              <polyline
                points="20 10 4 10 7 7"
                style={{
                  fill: "none",
                  stroke: "#ffffff",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 1.5,
                }}
              />
            </svg>
          </div>

          {/* Output field */}
          <div className="relative flex items-center gap-x-2">
            <input
              id="outputAmount"
              type="text"
              placeholder="Output"
              className="w-full py-2 px-2 rounded border border-pink-300 dark:border-white bg-white/80 focus:outline-none text-gray-800"
              onKeyPress={handleKeyPress}
              value={outputAmount}
              onChange={(e) => handleOutputChange(e.target.value)}
            />
            <select
              disabled
              className="w-32 py-2 px-2 rounded border border-pink-300 dark:border-white bg-pink-200 text-white font-bold focus:outline-none cursor-not-allowed disabled:opacity-100 disabled:text-white"
              style={{
                pointerEvents: "none",
                backgroundImage: `url(${outputCurrencyData?.imgSrc})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "5px 50%",
                backgroundSize: "30px",
                paddingLeft: "2.4rem",
                paddingRight: "1rem",
              }}
              value={outputCurrency}
              onChange={(e) => setOutputCurrency(e.target.value)}
            >
              {toCurrencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col items-center">
            <Button size="lg" onClick={handleClaim} className="mt-4">
              Claim CAMT
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Button size="lg" onClick={handleClaimAndStake}>
              Claim CAMT and Stake
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroRightSection;
