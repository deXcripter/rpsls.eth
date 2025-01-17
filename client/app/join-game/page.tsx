"use client";

import Elements from "@/components/Elements";
import { TransactionContext } from "@/context/TransactionContext";
import { play, claimPlayer1Timeout } from "@/contract";
import axiosInstance from "@/utils/axios";
import { useContext, useState } from "react";

const elementsTag = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function page() {
  const { handleWalletConnection, userWallet, signer } =
    useContext(TransactionContext);
  const [startGame, setStartGame] = useState(true);
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string>("Select one");
  const [contractAddress, setContractAddress] = useState("");

  const handleSubmitMove = async () => {
    if (!userChoice) return;
    console.log("going");
    try {
      const res = await axiosInstance.get("/join-game", {
        params: {
          opponentWallet: userWallet,
        },
      });

      const { contractAddress, timeLeft, stake, contract } = res.data as {
        opponentWallet: number;
        contractAddress: string;
        contract: any;
        timeLeft?: number;
        stake: number;
      };
      setContractAddress(contractAddress);
      await play(contractAddress, userChoice, signer!);
      setPrompt("Ask your opponent to reveal move");
      setStartGame(false); // Set to false to indicate the game has started
    } catch (err) {
      setPrompt("Ask Player 1 to start the game with your wallet address");
      console.log(err);
    }
  };

  const handleClaimStake = async () => {
    if (!contractAddress) return;
    try {
      await claimPlayer1Timeout(contractAddress, signer!);
      setPrompt("Stake claimed successfully!");
    } catch (err) {
      console.error("Error claiming stake:", err);
      setPrompt("Failed to claim stake.");
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
      </div>

      <div className={`${!startGame && "hidden"}`}>
        <h1 className="text-center text-4xl mt-10 text-yellow-400 font-semibold">
          {prompt}
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
          className={`${
            userChoice && userWallet ? "bg-green-600" : "bg-gray-600 "
          } w-[40%] mx-auto px-2 py-2`}
          onClick={handleSubmitMove}
          disabled={!userChoice || !userWallet}
        >
          Submit Move
        </button>

        {/* Claim Stake Button */}
        {!startGame && (
          <button
            className="bg-blue-600 w-[40%] mx-auto px-2 py-2"
            onClick={handleClaimStake}
          >
            Claim Stake
          </button>
        )}
      </div>
    </div>
  );
}

export default page;
