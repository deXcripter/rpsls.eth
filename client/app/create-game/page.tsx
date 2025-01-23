"use client";

import Elements from "@/components/Elements";
import Loader from "@/components/Loader";
import { TransactionContext } from "@/context/TransactionContext";
import {
  checkWinForPlayer1,
  checkWinForPlayer2,
  claimPlayer1Timeout,
  createGame,
  solveGame,
} from "@/contract";
import axiosInstance from "@/utils/axios";
import hashMove from "@/utils/hash";
import { useState, useContext, useEffect } from "react";
import { sendHash } from "@/utils/jwt-hash";
import { showErrorToast } from "@/utils/toast";
import SocketContext from "@/context/SocketContext";
import CountdownTimer from "@/components/Timer";

const elementsTag = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function Page() {
  const [startGame, setStartGame] = useState(false);
  const [opponentWallet, setOpponentWallet] = useState("");
  const [stake, setStake] = useState<string>("");
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [prompt, setPrompt] = useState<string>("Select one");
  const [salt, setSalt] = useState<null | number>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [canRevealMove, setCanRevealMove] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [time, setTime] = useState(300);
  const [canReloadGame, setCanReloadGame] = useState(false);
  const [claimedStake, setClaimedStake] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { handleWalletConnection, userWallet, signer, connectingWallet } =
    useContext(TransactionContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const hash = sendHash();
    setSalt(hash);
  }, []);

  // Add a flag or use useCallback to prevent multiple listeners
  useEffect(() => {
    const handleUser2Played = () => {
      setTime(300);
      setPrompt("Your opponent has played. Reveal your move now");
      setCanRevealMove(true);
    };

    socket?.on("user-2-played", handleUser2Played);

    return () => {
      socket?.off("user-2-played", handleUser2Played);
    };
  }, [socket]);

  const handleOpponentSetWallet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpponentWallet(e.target.value);
  };

  const handleStartGame = () => {
    if (!opponentWallet) {
      return showErrorToast("Please enter your opponent's wallet address");
    }
    if (!userWallet) {
      return showErrorToast("Please connect your wallet");
    }
    if (!stake || typeof Number(stake) !== "number") {
      return showErrorToast("Please enter a valid stake amount");
    }

    setStartGame(true);
  };

  const handleSubmitMove = async () => {
    if (!signer) return alert("Please refresh your browser and try again");

    if (!userChoice) {
      alert("Please select a move");
      return;
    }

    console.log(stake);

    setLoading(true);
    try {
      setCanReloadGame(false);
      const hashedMove = hashMove(userChoice!, salt!);
      const { contractAddress, rpsContract } = await createGame(
        hashedMove,
        opponentWallet,
        stake,
        signer!
      );
      setContractAddress(contractAddress);
      setHasPlayed(true);
      await axiosInstance.post("/start-game", {
        contractAddress,
        opponentWallet,
        stake,
        contract: rpsContract,
      });
      setPrompt("Ask your opponent to play their move");
    } catch (err) {
      setPrompt("Something went wrong. Please try again");
      console.log(err);
      setCanReloadGame(true);
    } finally {
      setLoading(false);
    }
  };

  const restartGame = () => {
    window.location.reload();
  };

  const handleClaimStake = async () => {
    if (!contractAddress) return;
    try {
      await claimPlayer1Timeout(contractAddress, signer!);
      setPrompt("Stake claimed successfully!");
      setClaimedStake(true);
      setGameOver(true);
    } catch (err) {
      console.error("Error claiming stake:", err);
      setPrompt("Failed to claim stake. Please try again in <5 mins");
    }
  };

  const handleRevealMove = async () => {
    if (!signer) return alert("Please refresh your browser and try again (");
    if (!userChoice || !salt) return;
    setRevealLoading(true);
    try {
      await solveGame(contractAddress, userChoice, salt, signer!);
      const player1Wins = await checkWinForPlayer1(
        contractAddress,
        userChoice,
        signer
      );
      const player2Wins = await checkWinForPlayer2(
        contractAddress,
        userChoice,
        signer
      );
      if (player1Wins && !player2Wins) {
        socket?.emit("game-revealed", {
          contractAddress,
          winner: userWallet,
          summary: "Player 1 wins",
        });
        setPrompt("You win!");
      }
      if (!player1Wins && player2Wins) {
        setPrompt("You lose!");
        socket?.emit("game-revealed", {
          contractAddress,
          winner: userWallet,
          summary: "Player 2 wins",
        });
      } else if (!player1Wins && !player2Wins) {
        setPrompt("It's a draw!");
        socket?.emit("game-revealed", {
          contractAddress,
          winner: "draw",
          summary: "It's a draw",
        });
        setCanReloadGame(true);
        setCanRevealMove(false);
        setGameOver(true);
      }
    } catch (err) {
      setCanReloadGame(true);
      console.log(err);
    } finally {
      setRevealLoading(false);
      setCanReloadGame(true);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 w-[50%] m-auto mt-10">
        {userWallet ? (
          <div
            className={`${
              !connectingWallet ? "bg-green-400" : "bg-slate-600"
            } px-4 py-2`}
          >
            {userWallet}
          </div>
        ) : (
          <button
            type="button"
            className="bg-green-400 px-4 py-2"
            onClick={() => handleWalletConnection()}
            disabled={connectingWallet || userWallet ? true : false}
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
          onChange={(e) => setStake(e.target.value)}
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
        <>
          <div className={`${!startGame && "hidden"}`}>
            <h1 className="text-center text-4xl mt-10 text-yellow-400 font-semibold">
              {prompt}
            </h1>
            <div className="flex justify-center gap-4 mt-4">
              {elementsTag.map((name) => (
                <Elements
                  key={name}
                  name={name}
                  setUserChoice={setUserChoice}
                  hasPlayed={hasPlayed}
                  userChoice={userChoice}
                />
              ))}
            </div>
          </div>
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

            {/* Only show after second player has played. */}
            {canRevealMove ||
              (!gameOver && (
                <button
                  className="bg-yellow-400 w-[40%] mx-auto px-2 py-2"
                  onClick={handleRevealMove}
                  disabled={revealed}
                >
                  Reveal Move
                </button>
              ))}

            {/* Only show this button when the user has not played */}
            {!hasPlayed && (
              <button
                className="bg-green-600 w-[40%] mx-auto px-2 py-2"
                onClick={handleSubmitMove}
              >
                Submit Move
              </button>
            )}

            {/* Only show this button when the user has played */}
            {(hasPlayed && !gameOver && !claimedStake) ||
              (!gameOver && (
                <CountdownTimer
                  setTimeLeft={setTime}
                  timeLeft={time}
                  handler={handleClaimStake}
                  hasClaimed={claimedStake}
                />
              ))}

            {canReloadGame && (
              <button
                className="bg-red-500 w-[40%] mx-auto px-2 py-2"
                onClick={restartGame}
              >
                Reload Game
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
