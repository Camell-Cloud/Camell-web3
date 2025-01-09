"use client";

import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components";
import { slideUp } from "@/styles/animations";
import { currencies } from "@/lib/content/cryptos";
import { WalletContext } from "@/context/WalletContext";
import { TronWeb } from "tronweb";

interface HeroRightSectionProps {
  getAnimationDelay: (i: number, increment?: number) => number;
}

const HeroRightSection: React.FC<HeroRightSectionProps> = ({ getAnimationDelay }) => {
  const [inputCurrency, setInputCurrency] = useState("TRON");
  const [outputCurrency, setOutputCurrency] = useState("CAMT");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [tronPrice, setTronPrice] = useState(0);
  const [camtPrice, setCamtPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { wallet, userAddress } = useContext(WalletContext);
  const contractAddress = process.env.NEXT_PUBLIC_TRON_CONTRACT_ADDRESS;

  const fetchPrice = async (symbol: string) => {
    try {
      const res = await fetch(`/api/quotes?symbol=${symbol}`);
      const data = await res.json();
      return data?.data?.[symbol]?.quote?.USD?.price || 0;
    } catch (error) {
      console.error(`Failed to fetch price for ${symbol}:`, error);
      return 0;
    }
  };

  useEffect(() => {
    const loadPrices = async () => {
      const [tron, camt] = await Promise.all([
        fetchPrice("TRX"),
        fetchPrice("CAMT"),
      ]);
      setTronPrice(tron);
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

    const numericValue = parseFloat(value);
    if (!value || isNaN(numericValue)) {
      setOutputAmount("");
      setErrorMessage(null);
      return;
    }

    if (numericValue < 10) {
      setErrorMessage("Input must be at least 10.");
      return;
    }

    setErrorMessage(null);

    const fromPrice = tronPrice;
    if (camtPrice === 0) {
      setErrorMessage("CAMT price is not available.");
      setOutputAmount("");
      return;
    }
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

    if (tronPrice === 0) {
      setErrorMessage("TRON price is not available.");
      return;
    }

    const fromPrice = tronPrice;
    const fromValue = (numericValue * camtPrice) / fromPrice; // Reverse calculation
    setInputAmount(fromValue.toFixed(6));
  };

  // --- TronLink-based "Claim" function -----------------------------------
  const handleClaim = async () => {
    if (errorMessage) {
      alert("Please input more than 10 TRX to proceed")
      return;
    }

    if (!contractAddress) {
      alert("환경 변수에 계약 주소가 정의되지 않았습니다."); // "Contract address not defined in environment variables."
      return;
    }
    if (!wallet || !userAddress) {
      alert("지갑이 연결되어 있지 않습니다."); // "Wallet is not connected."
      return;
    }

    const tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
    });

    try {
      const numericInputAmount = parseFloat(inputAmount);
      if (isNaN(numericInputAmount)) {
        alert("유효하지 않은 입력 금액입니다."); // "Invalid input amount."
        return;
      }

      const numericOutputAmount = parseFloat(outputAmount);
      if (isNaN(numericOutputAmount)) {
        alert("유효하지 않은 출력 금액입니다."); // "Invalid output amount."
        return;
      }

      const trxAmount = Number(tronWeb.toSun(numericInputAmount));
      const camtAmount = (BigInt(Math.floor(numericOutputAmount)) * BigInt(10 ** 18)).toString(); // Ensure it's a string

      // Create unsigned transaction
      const unsignedTx = await tronWeb.transactionBuilder.triggerSmartContract(
        tronWeb.address.toHex(contractAddress),
        "purchaseWithTRX(uint256)",
        { callValue: trxAmount },
        [{ type: "uint256", value: camtAmount }],
        tronWeb.address.toHex(userAddress)
      );

      console.log("Unsigned Transaction:", unsignedTx);

      if (!unsignedTx.result || !unsignedTx.transaction) {
        throw new Error("트랜잭션 생성 실패"); // "Transaction creation failed."
      }

      // WalletConnect를 통한 트랜잭션 서명 요청
      const signedTx = await wallet.signTransaction({
        transaction: unsignedTx.transaction,
      });

      console.log("Signed Transaction:", signedTx);

      if (!signedTx || !signedTx.signature) {
        throw new Error("트랜잭션 서명 실패"); // "Transaction signing failed."
      }

      // 서명된 트랜잭션 전송
      const broadcast = await tronWeb.trx.sendRawTransaction({
        ...signedTx,
        signature: signedTx.signature,
      });

      if (broadcast.result) {
        alert("purchaseWithTRX 호출 성공!"); // "purchaseWithTRX call succeeded!"
        const transactionInfo = await tronWeb.trx.getTransaction(signedTx.txID);
        console.log("Transaction Info:", transactionInfo);
      } else {
        console.error("트랜잭션 전송 실패:", broadcast); // "Transaction broadcast failed."
        throw new Error("트랜잭션 전송 실패"); // "Transaction broadcast failed."
      }
    } catch (error: any) {
      console.error("Error during claim:", error);
      alert(`purchaseWithTRX 호출 실패: ${error.message || error}`); // "purchaseWithTRX call failed: [error]"
    }
  };

  // --- Example second button (Claim & Stake, etc.) -----------------------
  const handleClaimAndStake = () => {
    console.log("Check Swap / Stake logic here...");
    // Implement your Claim & Stake logic here
  };

  // --- Filtering currencies (TRON -> CAMT) -------------------------------
  const fromCurrencies = currencies.filter(
    (currency) => currency.value === "TRON"
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
          className="p-8 rounded-lg border-2 border-pink-300 dark:border-white bg-opacity-50 backdrop-blur-lg flex flex-col gap-2"
        >
          {errorMessage && (
            <p className="text-red-500 text-sm text-left w-full">
              {errorMessage}
            </p>
          )}
          {/* Input field */}
          <div className="relative flex items-center gap-x-2">
            <input
              id="inputAmount"
              type="text"
              className={`w-full py-2 px-2 rounded border ${errorMessage
                ? "border-red-500 focus:border-red-600"
                : "border-pink-300 dark:border-white"
                } bg-white/80 focus:outline-none text-gray-800`}
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
          <p className="text-black-500 text-sm text-left w-full">
            Please do keep in mind that there is a charge of 5 TRX Coin when Converting.
          </p>

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
