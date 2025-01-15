import http from "http";
import app from "./app";

const server = http.createServer(app);
const port = 4444;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
