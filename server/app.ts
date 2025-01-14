import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// routes & interface

interface iGames {
  opponentWallet: number;
  contractAddress: string;
  timeLeft?: number;
}

const Games: iGames[] = [];

app.use("/start-game", (req, res) => {
  const { opponentWallet, contractAddress, timeLeft = 5 } = req.body;
  Games.push({ opponentWallet, contractAddress, timeLeft });
  res.send("Game started");
});

app.use("/join-game", (req, res) => {
  const { opponentWallet } = req.body;
  const game = Games.find((game) => game.opponentWallet === opponentWallet);
  if (game) {
    res.send(game);
  } else {
    res.send("No game found");
  }
});

export default app;
