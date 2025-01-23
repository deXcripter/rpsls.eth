import React, { useEffect, useState } from "react";

const CountdownTimer = ({
  timeLeft: timeLeft,
  setTimeLeft = () => {},
  handler = () => {},
  hasClaimed = false,
}: {
  timeLeft: number;
  hasClaimed: boolean;
  setTimeLeft: (time: number | ((prevTime: number) => number)) => void;
  handler: () => void;
}) => {
  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime: number) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, setTimeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div style={{ textAlign: "center", fontSize: "2rem", marginTop: "2px" }}>
      {timeLeft > 0 && <p>{formatTime(timeLeft)}</p>}
      {timeLeft <= 0 && (
        <button
          className={`bg-blue-600 w-[40%] text-sm mx-auto px-2 py-2`}
          onClick={handler}
          disabled={hasClaimed}
        >
          Claim Stake
        </button>
      )}
    </div>
  );
};

export default CountdownTimer;
