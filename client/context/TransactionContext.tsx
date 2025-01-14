"use client";
import React, { createContext, useContext, useState } from "react";

interface iTransactionContext {
  transaction: boolean;
  setTransaction: (value: boolean) => void;
  wallet: boolean;
  setWallet: (value: boolean) => void;
}

export const TransactionContext = createContext<iTransactionContext>({
  transaction: false,
  setTransaction: () => {},
  wallet: false,
  setWallet: () => {},
});

function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transaction, setTransaction] = useState(false);
  const [wallet, setWallet] = useState(false);
  return (
    <TransactionContext.Provider
      value={{ transaction, setTransaction, wallet, setWallet }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export default TransactionProvider;
