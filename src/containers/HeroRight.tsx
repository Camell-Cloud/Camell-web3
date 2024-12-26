"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components";
import { slideUp } from "@/styles/animations";
import { currencies } from "@/lib/content/cryptos";

interface HeroRightSectionProps {
  getAnimationDelay: (i: number, increment?: number) => number;
}

const HeroRightSection: React.FC<HeroRightSectionProps> = ({ getAnimationDelay }) => {
  const [inputCurrency, setInputCurrency] = useState("TRON");
  const [outputCurrency, setOutputCurrency] = useState("CAMT");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [tronPrice, setTronPrice] = useState(0);
  const [usdtPrice, setUsdtPrice] = useState(0);
  const [camtPrice, setCamtPrice] = useState(0);

  const fromCurrencies = currencies.filter(
    (currency) => currency.value === "TRON" || currency.value === "USDT"
  );
  const toCurrencies = currencies.filter(
    (currency) => currency.value === "CAMT"
  );
  const inputCurrencyData = fromCurrencies.find((c) => c.value === inputCurrency);
  const outputCurrencyData = toCurrencies.find((c) => c.value === outputCurrency);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedChars = /[0-9.]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

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

    const out = (numericValue * fromPrice) / camtPrice;
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

    const fromValue = (numericValue * camtPrice) / fromPrice;
    setInputAmount(fromValue.toFixed(6));
  };

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
          {/* Input */}
          <div className="relative flex items-center gap-x-2">
            <input
              id="intputAmount"
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

          {/* Arrow */}
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

          {/* Output */}
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
            <Button
              size="lg"
              onClick={() => console.log("Check Swap")}
              className="mt-4"
            >
              Claim CAMT
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Button size="lg" onClick={() => console.log("Check Swap")}>
              Claim CAMT and Stake
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroRightSection;
