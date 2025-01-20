"use client";
import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { isValidEthereumAddress } from "@/utils/wallet-validator";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}

interface iTransactionContext {
  userWallet: string | null;
  handleWalletConnection: () => void;
  provider: any;
  signer: ethers.ContractRunner | null;
}

export const TransactionContext = createContext<iTransactionContext>({
  userWallet: null,
  handleWalletConnection: () => {},
  provider: null,
  signer: null,
});

function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [userWallet, setUserWallet] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
  }, []);

  const handleWalletConnection = async () => {
    try {
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const validAddress = isValidEthereumAddress(accounts[0]);
      if (!validAddress) return alert("Invalid wallet address");

      setUserWallet(validAddress as string);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const chain = await provider.getNetwork();
      if (Number(chain.chainId) !== 11155111) {
        alert("Switching you to the sepolia network");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      } else console.log("Connected to the sepolia network");
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);

      return validAddress as string;
    } catch (error) {}
  };

  return (
    <TransactionContext.Provider
      value={{
        userWallet,
        handleWalletConnection,
        provider,
        signer,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionProvider;
