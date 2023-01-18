const app = require("express")();

const httpServer = require("http").Server(app);

const sock = require("socket.io")(httpServer, {
  cors: {
    origins: ["http://localhost:8080"],
  },
});

sock.on("connection", (socket) => {
  console.log("player connected");

  socket.on("disconnect", () => {
    console.log("player disconnected");
  });

  socket.on("move", ({ x, y }) => {
    socket.broadcast.emit("move", { x, y });
  });
  socket.on("moveEnd", () => {
    socket.broadcast.emit("moveEnd");
  });
});

httpServer.listen(3000, () => {
  console.log("server listening on localhost:3000");
});
