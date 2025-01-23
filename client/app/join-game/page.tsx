"use client";

import Elements from "@/components/Elements";
import { TransactionContext } from "@/context/TransactionContext";
import { play, claimPlayer2Timeout } from "@/contract";
import axiosInstance from "@/utils/axios";
import { useContext, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import SocketContext from "@/context/SocketContext";
import CountdownTimer from "@/components/Timer";
import { showErrorToast } from "@/utils/toast";

const elementsTag = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

function page() {
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string>("Select one");
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [canReloadGame, setCanReloadGame] = useState(false);
  const [time, setTime] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const [claimStake, setClaimStake] = useState(false);
  const { handleWalletConnection, userWallet, signer } =
    useContext(TransactionContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    socket.on("game-over", (data) => {
      const winner = data.gameData.summary === "Player 2 winner";
      winner && setPrompt("You won!");
      !winner && setPrompt(`${data.gameData.summary}`);
      setCanReloadGame(true);
      setGameOver(true);
    });

    return () => {
      socket.off("game-over");
    };
  }, [socket]);

  const handleSubmitMove = async () => {
    if (!userChoice) return;
    setLoading(true);
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
      setHasPlayed(true);
      socket!.emit("game-joined", {
        contractAddress,
        timeLeft: 300,
        stake,
        contract,
      });
    } catch (err) {
      showErrorToast("Failed to join game. Please try again");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimStake = async () => {
    if (!contractAddress) return;
    try {
      await claimPlayer2Timeout(contractAddress, signer!);
      setPrompt("Stake claimed successfully!");
      setClaimStake(true);
      setCanReloadGame(true);
    } catch (err) {
      console.error("Error claiming stake:", err);
      showErrorToast("Failed to claim stake. Please try");
    }
  };

  const restartGame = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen">
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

      <div className={``}>
        <h1 className="text-center text-4xl mt-10 text-yellow-400 font-semibold">
          {prompt}
        </h1>
        <div className="flex justify-center gap-4 mt-4">
          {elementsTag.map((name) => (
            <Elements
              key={name}
              name={name}
              setUserChoice={setUserChoice}
              userChoice={userChoice}
              hasPlayed={hasPlayed}
            />
          ))}
        </div>
      </div>

      <div className="flex mx-auto w-[50%] mt-[5%] text-lg flex-col gap-5">
        <div className="mx-auto">
          {userChoice && <div>Your choice: {elementsTag[userChoice - 1]}</div>}
        </div>
        {loading && <Loader message="Submitting move" />}
        {!loading && !hasPlayed && !gameOver && (
          <button
            type="button"
            className={`${
              userChoice && userWallet ? "bg-green-600" : "bg-gray-600"
            } w-[40%] mx-auto px-2 py-2 ${hasPlayed && "hidden"}`}
            onClick={handleSubmitMove}
            disabled={!userChoice || !userWallet}
          >
            Submit Move
          </button>
        )}
        {/* Only show this button when the user has played */}

        {(hasPlayed && !gameOver) ||
          (claimStake && (
            <CountdownTimer
              setTimeLeft={setTime}
              timeLeft={time}
              handler={handleClaimStake}
              hasClaimed={claimStake}
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
    </div>
  );
}

export default page;
