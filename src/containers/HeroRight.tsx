'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components';
import { slideUp } from '@/styles/animations';
import { currencies } from '@/lib/content/cryptos';

const HeroRightSection = ({
  getAnimationDelay,
}: {
  getAnimationDelay: (i: number, increment?: number) => number;
}) => {
  // State to track selected currency for input and output
  const [inputCurrency, setInputCurrency] = useState('TRON');
  const [outputCurrency, setOutputCurrency] = useState('TRON');

  const inputCurrencyData = currencies.find(c => c.value === inputCurrency);
  const outputCurrencyData = currencies.find(c => c.value === outputCurrency);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only digits (0-9) and control keys like backspace
    const allowedChars = /[0-9]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6">
      <motion.div
        variants={slideUp({ delay: getAnimationDelay(3) })}
        initial="hidden"
        animate="show"
        className="w-[490px] h-[700px] flex flex-col justify-between items-center rounded-lg border-2 border-pink-300 dark:border-white bg-opacity-50 backdrop-blur-lg p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        <h1 className="text-4xl mt-2 font-bold tracking-tighter text-pink-500 dark:text-pink-300">
          BUY CAMT NOW
        </h1>
        <h1 className="text-lg mt-2 font-bold text-pink-500 dark:text-pink-300 tracking-tighter">
          1 CAMT = $0.0069
        </h1>

        {/* Currency Converter Widget */}
        <div
          id="exchangeWidget"
          className="p-8 rounded-lg border-2 border-pink-300 dark:border-white bg-opacity-50 backdrop-blur-lg flex flex-col gap-6"
        >
          {/* From Amount + Currency */}
          <div id="intputAmountArea" className="relative flex items-center">
            <div className="relative w-full">
              <div className="absolute left-0 top-0 h-full flex items-center border-r border-pink-300 dark:border-white">
                {inputCurrencyData && (
                  <img
                    src={inputCurrencyData.imgSrc}
                    alt={inputCurrencyData.label}
                    className="w-5 h-5 ml-1 mr-1"
                  />
                )}
                <select
                  className="h-full px-2 rounded-l bg-pink-200 hover:bg-pink-300 text-gray-700 focus:outline-none"
                  style={{ width: '60px' }}
                  value={inputCurrency}
                  onChange={(e) => setInputCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                id="intputAmount"
                type="text"
                className="w-full py-2 pl-20 pr-2 rounded border border-pink-300 dark:border-white bg-white/80 focus:outline-none text-gray-800"
                placeholder="Enter amount"
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex items-center justify-center">
            <svg
              width="30"
              height="30"
              fill="#000000"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="icon line mx-4"
            >
              <polyline
                points="4 14 20 14 17 17"
                style={{
                  fill: 'none',
                  stroke: '#ffffff',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 1.5,
                }}
              />
              <polyline
                points="20 10 4 10 7 7"
                style={{
                  fill: 'none',
                  stroke: '#ffffff',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeWidth: 1.5,
                }}
              />
            </svg>
          </div>

          {/* To Amount + Currency */}
          <div id="outputArea" className="relative flex items-center">
            <div className="relative w-full">
              <div className="absolute left-0 top-0 h-full flex items-center border-r border-pink-300 dark:border-white">
                {outputCurrencyData && (
                  <img
                    src={outputCurrencyData.imgSrc}
                    alt={outputCurrencyData.label}
                    className="w-5 h-5 ml-1 mr-1"
                  />
                )}
                <select
                  className="h-full px-2 rounded-l bg-pink-200 hover:bg-pink-300 text-gray-700 focus:outline-none"
                  style={{ width: '60px' }}
                  value={outputCurrency}
                  onChange={(e) => setOutputCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                id="outputAmount"
                type="text"
                placeholder="Output"
                className="w-full py-2 pl-20 pr-2 rounded border border-pink-300 dark:border-white bg-white/80 focus:outline-none text-gray-800"
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <Button size="lg" onClick={() => console.log('Check Swap')} className="mt-4">
            Check Swap
          </Button>
        </div>

        {/* Buy with Crypto Button */}
        <div className="flex flex-col items-center">
          <Button size="lg" onClick={() => console.log('Buy with Crypto')}>
            Buy with Crypto
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroRightSection;
