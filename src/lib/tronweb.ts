import { TronWeb } from "tronweb";

const setupTronWeb = (privateKey: string) => {
  const tronWebInstance = new TronWeb({
    fullHost: "https://api.trongrid.io", // or "https://api.shasta.trongrid.io" for testnet
    privateKey,
  });
  return tronWebInstance;
};

export default setupTronWeb;