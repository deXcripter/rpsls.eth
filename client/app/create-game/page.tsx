"use client";

import Elements from "@/components/Elements";
import { TransactionContext } from "@/context/TransactionContext";
import { createGame } from "@/contract";
import axiosInstance from "@/utils/axios";
import hashMove from "@/utils/hash";
import { useState, useContext } from "react";

const elementsTag = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function Page() {
  const [startGame, setStartGame] = useState(false);
  const [opponentWallet, setOpponentWallet] = useState("");
  const [stake, setStake] = useState<number | string>("");
  const { handleWalletConnection, userWallet } = useContext(TransactionContext);
  const [userChoice, setUserChoice] = useState<number | null>(null);

  const handleOpponentSetWallet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpponentWallet(e.target.value);
  };

  const handleStartGame = () => {
    if (!opponentWallet) {
      alert("Please enter your opponent's wallet address");
      return;
    }
    if (!userWallet) {
      alert("Please connect your wallet");
      return;
    }
    if (!stake || typeof Number(stake) !== "number") {
      alert("Please enter a valid stake amount");
      return;
    }

    setStartGame(true);
  };

  const handleSubmitMove = async () => {
    if (!userChoice) {
      alert("Please select a move");
      return;
    }

    try {
      await axiosInstance.post("/start-game", {
        userWallet,
        opponentWallet,
        stake,
        userChoice,
      });

      console.log("hmm");

      const hashedMove = hashMove(userChoice, "some hash should be here"); // TODO: Add salt

      console.log(hashedMove);

      await createGame(hashedMove, opponentWallet, Number(stake));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 w-[50%] m-auto mt-10">
        {userWallet ? (
          <div className="bg-green-400 px-4 py-2">{userWallet}</div>
        ) : (
          <button
            type="button"
            className="bg-green-400 px-4 py-2"
            onClick={() => handleWalletConnection()}
          >
            Connect Wallet
          </button>
        )}
        <input
          type="text"
          name="Opponent Wallet"
          id=""
          className="border-2 outline-none px-4 py-2"
          placeholder="Opponent Address"
          value={opponentWallet}
          onChange={handleOpponentSetWallet}
        />
        <input
          type="number"
          placeholder="Enter your stake amount (ETH)"
          className="border-2 outline-none py-2 px-4"
          value={stake}
          onChange={(e) => setStake(Number(e.target.value))}
        />
        <button className="bg-blue-400 px-4 py-2" onClick={handleStartGame}>
          Start Game
        </button>
      </div>

      <div className={`${!startGame && "hidden"}`}>
        <h1 className="text-center text-4xl mt-10 text-yellow-400 font-semibold">
          Select one
        </h1>
        <div className="flex justify-center gap-4 mt-4">
          {elementsTag.map((name) => (
            <Elements key={name} name={name} setUserChoice={setUserChoice} />
          ))}
        </div>
      </div>

      <div className="flex mx-auto w-[50%] mt-[5%] text-lg flex-col gap-5">
        <div className="mx-auto">
          {startGame && userChoice && (
            <div>Your choice: {elementsTag[userChoice - 1]}</div>
          )}
        </div>
        <button
          className="bg-green-600 w-[40%] mx-auto px-2 py-2"
          onClick={handleSubmitMove}
        >
          Submit Move
        </button>
      </div>
    </div>
  );
}

export default Page;
