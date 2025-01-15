import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes & interface

interface iGames {
  opponentWallet: number;
  contractAddress: string;
  timeLeft?: number;
}

const Games: iGames[] = [];

app.post("/start-game", (req, res) => {
  const { opponentWallet, contractAddress, timeLeft = 5 } = req.body;
  Games.push({ opponentWallet, contractAddress, timeLeft });
  res.send("Game started");
});

app.get("/join-game", (req, res) => {
  const { opponentWallet } = req.body;
  const game = Games.find((game) => game.opponentWallet === opponentWallet);
  if (game) {
    res.send(game);
  } else {
    res.send("No game found");
  }
});

app.use("/*", (req, res) => {
  res.send("This route does not exist");
});

export default app;
