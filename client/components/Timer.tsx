import React, { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div style={{ textAlign: "center", fontSize: "2rem", marginTop: "20px" }}>
      <h1>Countdown Timer</h1>
      <p>{formatTime(timeLeft)}</p>
      {timeLeft <= 0 && <h2>Time's up!</h2>}
    </div>
  );
};

export default CountdownTimer;
