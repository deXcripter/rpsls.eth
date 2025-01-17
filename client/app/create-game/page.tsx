"use client";

import Elements from "@/components/Elements";
import Loader from "@/components/Loader";
import { TransactionContext } from "@/context/TransactionContext";
import { claimPlayer1Timeout, createGame, solveGame } from "@/contract";
import axiosInstance from "@/utils/axios";
import hashMove from "@/utils/hash";
import { useState, useContext, useEffect } from "react";

const elementsTag = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function Page() {
  const [startGame, setStartGame] = useState(false);
  const [opponentWallet, setOpponentWallet] = useState("");
  const [stake, setStake] = useState<number | string>("");
  const { handleWalletConnection, userWallet, signer } =
    useContext(TransactionContext);
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [submittedMove, setSubmittedMove] = useState(false);
  const [prompt, setPrompt] = useState<string>("Select one");
  const [salt, setSalt] = useState<null | number>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);

  useEffect(() => {
    setSalt(Math.round(Math.random() * 10000));
  }, []);

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
    if (!signer) return alert("There is no signer presnet");

    if (!userChoice) {
      alert("Please select a move");
      return;
    }
    setLoading(true);

    try {
      const hashedMove = hashMove(userChoice, salt!);
      const { contractAddress, rpsContract } = await createGame(
        hashedMove,
        opponentWallet,
        Number(stake),
        signer!
      );

      if (!contractAddress) return;
      setContractAddress(contractAddress);
      await axiosInstance.post("/start-game", {
        contractAddress,
        opponentWallet,
        stake,
        contract: rpsContract,
      });
      setSubmittedMove(true);
      setPrompt("Ask your opponent to play their move");
      setHasPlayed(true);
    } catch (err) {
      setPrompt("Something went wrong. Please try again");
      // setStartGame(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimStake = async () => {
    if (!contractAddress) return;
    try {
      await claimPlayer1Timeout(contractAddress, signer!);
      setPrompt("Stake claimed successfully!");
    } catch (err) {
      console.error("Error claiming stake:", err);
      setPrompt("Failed to claim stake. Please try again in 5 mins");
    }
  };

  const handleRevealMove = async () => {
    if (!signer) return alert("There is no signer presnet");
    setRevealLoading(true);
    try {
      const res = await solveGame(contractAddress, userChoice!, salt!, signer!);
      console.log(res);
    } catch (err) {
      console.log(err);
      // TODO : This should probably delete the entry from the server as well
    } finally {
      setRevealLoading(false);
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
          Show elements
        </button>
      </div>

      {/*
       * If loading is true show the Loader component with the message "Creating Game"
       * If revealLoading is true, show the Loader component with the message "Revealing Game"
       * Else, show the game elements and the prompt
       */}
      {loading && <Loader message="Creating Game" />}
      {revealLoading && <Loader message="Revealing Game" />}
      {!loading && !revealLoading && (
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
      )}

      <div
        className={`${
          !startGame && "hidden"
        } flex mx-auto w-[50%] mt-[5%] text-lg flex-col gap-5`}
      >
        <div className="mx-auto">
          {startGame && userChoice && (
            <div>Your choice: {elementsTag[userChoice - 1]}</div>
          )}
        </div>
        {submittedMove ? (
          <button
            className="bg-yellow-400 w-[40%] mx-auto px-2 py-2"
            onClick={handleRevealMove}
          >
            Reveal Move
          </button>
        ) : (
          <button
            className="bg-green-600 w-[40%] mx-auto px-2 py-2"
            onClick={handleSubmitMove}
          >
            Submit Move
          </button>
        )}
        {/* Only show this button when the user has played */}
        {hasPlayed && (
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

export default Page;
