import http from "http";
import app from "./app";
import { Server } from "socket.io";

const server = http.createServer(app);
const port = 4444;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  // emitted when a user joins a game and made their move
  socket.on("game-joined", (gameData: any) => {
    socket.broadcast.emit("user-2-played", {
      gameData,
    });
    console.log("user 2 made their move");
  });

  socket.on("game-revealed", (gameData) => {
    socket.broadcast.emit("game-over", {
      gameData,
    });
  });
});
