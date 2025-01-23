"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Games = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
exports.Games = [];
app.post("/start-game", (req, res) => {
    const { opponentWallet, contractAddress, timeLeft = Date.now(), stake, contract, } = req.body;
    const existingGameIndex = exports.Games.findIndex((game) => game.opponentWallet === opponentWallet);
    if (existingGameIndex !== -1) {
        exports.Games[existingGameIndex] = {
            opponentWallet,
            contractAddress,
            timeLeft,
            stake,
            contract,
        };
    }
    else {
        exports.Games.push({ opponentWallet, contractAddress, timeLeft, stake, contract });
        console.log(`New game started for ${opponentWallet}`);
    }
    console.log(exports.Games);
    res.send("Game started");
});
app.get("/join-game", (req, res) => {
    const { opponentWallet } = req.query;
    for (let i = 0; i < exports.Games.length; i++) {
        console.log(exports.Games[i].opponentWallet, opponentWallet);
    }
    const game = exports.Games.find((game) => game.opponentWallet === opponentWallet);
    if (game) {
        res.json(game);
    }
    else {
        res.status(404).send("No game found");
    }
});
app.delete("/end-game", (req, res) => {
    const { opponentWallet } = req.query;
    const gameIndex = exports.Games.findIndex((game) => game.opponentWallet === opponentWallet);
    if (gameIndex !== -1) {
        exports.Games.splice(gameIndex, 1);
        res.send("Game ended");
    }
    else {
        res.status(404).send("Game not found");
    }
});
app.use("/*", (req, res) => {
    res.send("This route does not exist");
});
exports.default = app;
