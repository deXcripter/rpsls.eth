"use client";
import React, { createContext, useState } from "react";

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
}

export const TransactionContext = createContext<iTransactionContext>({
  transaction: false,
  userWallet: null,
  handleWalletConnection: () => {},
});

function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transaction, setTransaction] = useState(false);
  const [userWallet, setUserWallet] = useState<string | null>(null);

  const handleWalletConnection = async () => {
    try {
      console.log("Connecting to wallet");
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserWallet(accounts[0]);
      console.log("Connected", accounts[0]);

      return accounts[0];
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{ transaction, userWallet, handleWalletConnection }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionProvider;
