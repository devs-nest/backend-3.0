const { GRID_SIZE } = require("./constants");

// Initialize the game sandbox
function initializeGame() {
  const state = createGameState();
  generateFoodRandomly(state);
  return state;
}

// Creating the initial values of both the players and size of the grid and storing them in an object
function createGameState() {
  return {
    players: [
      {
        position: {
          x: 3,
          y: 10,
        },
        velocity: {
          x: 1,
          y: 0,
        },
        snake: [
          { x: 1, y: 10 },
          { x: 2, y: 10 },
          { x: 3, y: 10 },
        ],
      },
      {
        position: {
          x: 18,
          y: 10,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        snake: [
          { x: 20, y: 3 },
          { x: 19, y: 3 },
          { x: 18, y: 3 },
        ],
      },
    ],
    food: {},
    gridsize: GRID_SIZE,
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  // Getting the first and second player from the state object
  const playerOne = state.players[0];
  const playerTwo = state.players[1];

  // Updating the position of the player one
  playerOne.position.x += playerOne.velocity.x;
  playerOne.position.y += playerOne.velocity.y;

  // Updating the position of the player two
  playerTwo.position.x += playerTwo.velocity.x;
  playerTwo.position.y += playerTwo.velocity.y;

  /*
  //* Logic for ending the game if the player is out of the grid
  // Checking if the player one is out of the grid
  if (
    playerOne.position.x < 0 ||
    playerOne.position.x > GRID_SIZE ||
    playerOne.position.y < 0 ||
    playerOne.position.y > GRID_SIZE
  ) {
    return 2;
  }

  // Checking if the player two is out of the grid
  if (
    playerTwo.position.x < 0 ||
    playerTwo.position.x > GRID_SIZE ||
    playerTwo.position.y < 0 ||
    playerTwo.position.y > GRID_SIZE
  ) {
    return 1;
  }
  */

  // Checking if the player one is out of the grid
  if (playerOne.position.x < 0) {
    playerOne.position.x = GRID_SIZE;
  } else if (playerOne.position.x > GRID_SIZE) {
    playerOne.position.x = 0;
  }
  if (playerOne.position.y < 0) {
    playerOne.position.y = GRID_SIZE;
  } else if (playerOne.position.y > GRID_SIZE) {
    playerOne.position.y = 0;
  }

  // Checking if the player two is out of the grid
  if (playerTwo.position.x < 0) {
    playerTwo.position.x = GRID_SIZE;
  } else if (playerTwo.position.x > GRID_SIZE) {
    playerTwo.position.x = 0;
  }
  if (playerTwo.position.y < 0) {
    playerTwo.position.y = GRID_SIZE;
  } else if (playerTwo.position.y > GRID_SIZE) {
    playerTwo.position.y = 0;
  }

  // Checking if the player one is eating the food and updating the position of the player one and generating the food randomly
  if (
    state.food.x === playerOne.position.x &&
    state.food.y === playerOne.position.y
  ) {
    playerOne.snake.push({ ...playerOne.position });
    playerOne.position.x += playerOne.velocity.x;
    playerOne.position.y += playerOne.velocity.y;
    generateFoodRandomly(state);
  }

  // Checking if the player two is eating the food and updating the position of the player two and generating the food randomly
  if (
    state.food.x === playerTwo.position.x &&
    state.food.y === playerTwo.position.y
  ) {
    playerTwo.snake.push({ ...playerTwo.position });
    playerTwo.position.x += playerTwo.velocity.x;
    playerTwo.position.y += playerTwo.velocity.y;
    generateFoodRandomly(state);
  }

  if (playerOne.velocity.x || playerOne.velocity.y) {
    for (let cell of playerOne.snake) {
      // Checking if the player one is bumping into itself and returning the player two as the winner
      if (cell.x === playerOne.position.x && cell.y === playerOne.position.y) {
        return 2;
      }
    }

    // Else increasing the length of the snake
    playerOne.snake.push({ ...playerOne.position });
    playerOne.snake.shift();
  }

  if (playerTwo.velocity.x || playerTwo.velocity.y) {
    for (let cell of playerTwo.snake) {
      // Checking if the player two is bumping into itself and returning the player one as the winner
      if (cell.x === playerTwo.position.x && cell.y === playerTwo.position.y) {
        return 1;
      }
    }

    // Else increasing the length of the snake
    playerTwo.snake.push({ ...playerTwo.position });
    playerTwo.snake.shift();
  }

  return false;
}

function generateFoodRandomly(state) {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };

  // Checking if the food is not on the snake of the player one, if it is then generating the food randomly again
  for (let cell of state.players[0].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return generateFoodRandomly(state);
    }
  }

  // Checking if the food is not on the snake of the player two, if it is then generating the food randomly again
  for (let cell of state.players[1].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return generateFoodRandomly(state);
    }
  }

  state.food = food; // Storing the food in the state object
}

// Updating the velocity of the player based on the key pressed, i.e., changing the direction of the snake
function getUpdatedVelocity(keyCode) {
  switch (keyCode) {
    case 37: {
      // left
      return { x: -1, y: 0 };
    }
    case 38: {
      // down
      return { x: 0, y: -1 };
    }
    case 39: {
      // right
      return { x: 1, y: 0 };
    }
    case 40: {
      // up
      return { x: 0, y: 1 };
    }
  }
}

module.exports = {
  initializeGame,
  gameLoop,
  getUpdatedVelocity,
};
