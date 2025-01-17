"use client";
import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}

interface iTransactionContext {
  transaction: boolean;
  userWallet: string | null;
  handleWalletConnection: () => void;
  provider: any;
  signer: ethers.ContractRunner | null;
}

export const TransactionContext = createContext<iTransactionContext>({
  transaction: false,
  userWallet: null,
  handleWalletConnection: () => {},
  provider: null,
  signer: null,
});

function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transaction, setTransaction] = useState(false);
  const [userWallet, setUserWallet] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    async function loadEthWindow() {
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
    }
    loadEthWindow();
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
      setUserWallet(accounts[0]);

      return accounts[0];
    } catch (error) {}
  };

  return (
    <TransactionContext.Provider
      value={{
        transaction,
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
