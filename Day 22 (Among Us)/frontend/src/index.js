import Phaser from "phaser";
import { io } from "socket.io-client";

import levelSprite from "./assets/ship.png";
import playerSprite from "./assets/player.png";

import {
  PLAYER_SPRITE_HEIGHT,
  PLAYER_SPRITE_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_START_X,
  PLAYER_START_Y,
} from "./constants";

import { movementAnimation, movePlayer } from "./utils";

const playerOne = {};
const playerTwo = {};

let socket;
let pressedKeys = [];

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    socket = io("localhost:3000");
    this.load.image("ship", levelSprite);
    this.load.spritesheet("player", playerSprite, {
      frameWidth: PLAYER_SPRITE_WIDTH,
      frameHeight: PLAYER_SPRITE_HEIGHT,
    });
    this.load.spritesheet("otherPlayer", playerSprite, {
      frameWidth: PLAYER_SPRITE_WIDTH,
      frameHeight: PLAYER_SPRITE_HEIGHT,
    });
  }

  create() {
    const ship = this.add.image(0, 0, "ship");
    
    playerOne.sprite = this.add.sprite(
      PLAYER_START_X,
      PLAYER_START_Y,
      "player"
    );
    playerOne.sprite.displayHeight = PLAYER_HEIGHT;
    playerOne.sprite.displayWidth = PLAYER_WIDTH;

    playerTwo.sprite = this.add.sprite(
      PLAYER_START_X,
      PLAYER_START_Y,
      "otherPlayer"
    );
    playerTwo.sprite.displayHeight = PLAYER_HEIGHT;
    playerTwo.sprite.displayWidth = PLAYER_WIDTH;

    this.anims.create({
      key: "running",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 60,
      reapeat: -1,
    });

    this.input.keyboard.on("keydown", (e) => {
      if (!pressedKeys.includes(e.code)) {
        pressedKeys.push(e.code);
      }
    });
    this.input.keyboard.on("keyup", (e) => {
      pressedKeys = pressedKeys.filter((key) => key !== e.code);
    });

    socket.on("move", ({ x, y }) => {
      console.log("revieved move");
      if (playerTwo.sprite.x > x) {
        playerTwo.sprite.flipX = true;
      } else if (playerTwo.sprite.x < x) {
        playerTwo.sprite.flipX = false;
      }
      playerTwo.sprite.x = x;
      playerTwo.sprite.y = y;
      playerTwo.moving = true;
    });
    socket.on("moveEnd", () => {
      console.log("revieved moveend");
      playerTwo.moving = false;
    });
  }

  update() {
    this.scene.scene.cameras.main.centerOn(
      playerOne.sprite.x,
      playerOne.sprite.y
    );
    const playerMoved = movePlayer(pressedKeys, playerOne.sprite);
    if (playerMoved) {
      socket.emit("move", { x: playerOne.sprite.x, y: playerOne.sprite.y });
      playerOne.movedLastFrame = true;
    } else {
      if (playerOne.movedLastFrame) {
        socket.emit("moveEnd");
      }
      playerOne.movedLastFrame = false;
    }
    movementAnimation(pressedKeys, playerOne.sprite);
    // Aninamte other player
    if (playerTwo.moving && !playerTwo.sprite.anims.isPlaying) {
      playerTwo.sprite.play("running");
    } else if (!playerTwo.moving && playerTwo.sprite.anims.isPlaying) {
      playerTwo.sprite.stop("running");
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1760,
  height: 670,
  scene: MyGame,
};

const game = new Phaser.Game(config);
