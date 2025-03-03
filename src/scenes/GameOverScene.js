import Phaser from "phaser";
import GameManager from "../utils/gameManager.js";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  restart() {
    GameManager.updateGameOver(false);
    GameManager.updateShouldRestart(false);
    this.scene.start("GameScene");
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
  }

  create(data) {
    this.add.image(400, 300, "sky");

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // wsService.send({ action: "end_game" });

    const scoreText = this.add
      .text(width / 2, height / 2 - 40, `Вы набрали: ${data.score} очков!`, {
        fontSize: "32px",
        fill: "#000",
      })
      .setOrigin(0.5, 0.5);
    const restartButton = this.add
      .text(width / 2, height / 2, "Играть снова", {
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
