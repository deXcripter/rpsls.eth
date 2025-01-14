"use client";

import Elements from "@/components/Elements";
import { TransactionContext } from "@/context/TransactionContext";
import { useState, useContext } from "react";

const elementsTag = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function Page() {
  const [startGame, setStartGame] = useState(false);
  const { handleWalletConnection } = useContext(TransactionContext);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 w-[50%] m-auto mt-10">
        <button
          type="button"
          className="bg-green-400 px-4 py-2"
          onClick={() => handleWalletConnection()}
        >
          Connect Wallet
        </button>
        <input
          type="text"
          name="Opponent Wallet"
          id=""
          className="border-2 outline-none px-4 py-2"
          placeholder="Opponent Address"
        />
        <input
          type="number"
          placeholder="Enter your stake amount (ETH)"
          className="border-2 outline-none py-2 px-4"
        />
        <button className="bg-blue-400 px-4 py-2">Start Game</button>
      </div>

      <div className={`${!startGame && "hidden"}`}>
        <h1 className="text-center text-4xl mt-10 text-yellow-400 font-semibold">
          Select one
        </h1>
        <div className="flex justify-center gap-4 mt-4">
          {elementsTag.map((name) => (
            <Elements key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
