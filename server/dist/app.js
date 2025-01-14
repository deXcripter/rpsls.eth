"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const Games = [];
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
    }
    else {
        res.send("No game found");
    }
});
exports.default = app;
