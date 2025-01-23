"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer(app_1.default);
const port = 4444;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
    },
});
io.on("connection", (socket) => {
    console.log("a user connected");
    // emitted when a user joins a game and made their move
    socket.on("game-joined", (gameData) => {
        socket.broadcast.emit("user-2-played", {
            gameData,
        });
        console.log("user 2 made their move");
    });
    socket.on("game-won", (gameData) => {
        socket.emit("game-over", {
            gameData,
        });
    });
});
