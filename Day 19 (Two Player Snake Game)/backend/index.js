const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
require("dotenv").config(); // Create a .env file in the root directory and add the PORT and NGROK_KEY variables in it

const PORT = process.env.PORT || 3000;

const { initializeGame, gameLoop, getUpdatedVelocity } = require("./game");
const { FRAME_RATE } = require("./constants");

const globalState = {};
const clientRooms = {};

// Function to check if game is running or not
function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(globalState[roomName]); //

    if (!winner) {
      emitGameState(roomName, globalState[roomName]);
    } else {
      emitGameOver(roomName, winner);
      globalState[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  // Send this event to everyone in the room.
  io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
  io.sockets.in(room).emit("gameOver", JSON.stringify({ winner }));
}

io.on("connection", (client) => {
  client.on("keydown", handleKeydown);
  client.on("newGame", handleNewGame);
  client.on("joinGame", handleJoinGame);

  // Fire this function whenever a user tries to enter an existing room
  function handleJoinGame(roomName) {
    const room = io.sockets.adapter.rooms[roomName]; // Get the room with the given code from the lookup table of all rooms

    let allUsers;
    if (room) {
      allUsers = room.sockets; // Get all the number of connected users in the room
    }

    let numberOfPlayers = 0;
    if (allUsers) {
      numberOfPlayers = Object.keys(allUsers).length; // Get the number of users in the room
    }

    if (numberOfPlayers === 0) {
      client.emit("unknownCode"); // If the room is not found then emit the unknownCode event
      return;
    } else if (numberOfPlayers > 1) {
      client.emit("tooManyPlayers"); // If the room is full, i.e, has more than one player present then emit the tooManyPlayers event
      return;
    }

    // If the room is found and has only one player then joining the room
    clientRooms[client.id] = roomName;
    client.join(roomName);

    client.number = 2; // Setting the number of the player to 2
    client.emit("init", 2); // Emitting the init event to the player with the number 2

    startGameInterval(roomName); // Initializing the game interval for the room
  }

  // Fire this function whenever a user tries to create a new room
  function handleNewGame() {
    let roomName = uuidv4(); // Generating a random 5 character code
    clientRooms[client.id] = roomName; // Storing the room name in the lookup table of all rooms
    client.emit("gameCode", roomName); // Emitting the gameCode event to the player with the room name

    globalState[roomName] = initializeGame(); // Initializing the game state for the room and storing it in the globalState object

    client.join(roomName); // Joining the room
    client.number = 1; // Setting the number of the player to 1
    client.emit("init", 1); // Emitting the init event to the player with the number 1
  }

  // Fire this function whenever a user presses a key
  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id]; // Getting the room name from the lookup table of all rooms
    // If the room name is not found then return
    if (!roomName) {
      return;
    }
    try {
      keyCode = parseInt(keyCode); // Converting the keyCode to an integer
    } catch (e) {
      console.error(e);
      return;
    }

    const velocity = getUpdatedVelocity(keyCode); // Getting the velocity of the snake based on the key pressed

    if (velocity) {
      globalState[roomName].players[client.number - 1].velocity = velocity; // Updating the velocity (position) of the snake
    }
  }
});

server.listen(PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
