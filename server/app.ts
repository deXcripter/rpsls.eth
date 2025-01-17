import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes & interface

interface iGames {
  opponentWallet: string;
  contractAddress: string;
  timeLeft?: Date;
  stake: number;
  contract: any;
}

const Games: iGames[] = [];

app.post("/start-game", (req, res) => {
  const {
    opponentWallet,
    contractAddress,
    timeLeft = Date.now(),
    stake,
    contract,
  } = req.body;

  Games.push({ opponentWallet, contractAddress, timeLeft, stake, contract });

  console.log(Games);
  res.send("Game started");
});

app.get("/join-game", (req, res) => {
  const { opponentWallet } = req.query;

  for (let i = 0; i < Games.length; i++) {
    console.log(Games[i].opponentWallet, opponentWallet);
  }
  const game = Games.find((game) => game.opponentWallet === opponentWallet);
  if (game) {
    res.json(game);
  } else {
    res.status(404).send("No game found");
  }
});

app.delete("/end-game", (req, res) => {
  const { opponentWallet } = req.query;

  const gameIndex = Games.findIndex(
    (game) => game.opponentWallet === opponentWallet
  );
  if (gameIndex !== -1) {
    Games.splice(gameIndex, 1);
    res.send("Game ended");
  } else {
    res.status(404).send("Game not found");
  }
});

app.use("/*", (req, res) => {
  res.send("This route does not exist");
});

export default app;
