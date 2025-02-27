import Phaser from "phaser";
import Player from "../objects/Player.js";
import Platform from "../objects/Platform.js";
import ScoreLabel from "../objects/ScoreLabel.js";
import Bomb from "../objects/Bomb.js";
import GameManager from "../utils/gameManager.js";
import GameOverLabel from "../objects/GameOverLabel.js";
import EventEmitter from "../utils/eventEmmiter.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import wsService from "../services/WebSocketService.js";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  restart() {
    GameManager.updateGameOver(false);
    GameManager.updateScore(0);
    GameManager.updateShouldRestart(false);
    EventEmitter.clear();
    this.scene.start("GameScene");
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
  }

  create(data) {
    console.log("DDL data", data);
    this.add.image(400, 300, "sky");

    wsService.send({ action: "end_game" });

    const restartButton = this.add
      .text(390, 250, "Играть снова", {
        fontSize: "32px",
        fill: "#000",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => {
        restartButton.setScale(0.9);
      })
      .on("pointerout", () => {
        restartButton.setScale(1);
      })
      .on("pointerdown", () => {
        this.restart();
      });
  }

  update() {}
}
