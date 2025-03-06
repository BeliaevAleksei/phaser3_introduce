import Phaser from "phaser";
import GameManager from "../utils/gameManager.js";

export default class StatisticScene extends Phaser.Scene {
  constructor() {
    super({ key: "StatisticScene" });
  }

  restart() {
    GameManager.updateGameOver(false);
    GameManager.updateShouldRestart(false);
    this.scene.start("GameScene");
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
  }

  displayLeaders(scene, leaders) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const text = "Топ 5 лидеров";
    scene.add
      .text(width / 2, height / 3 - 35, text, {
        font: "24px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 1);

    let players = "";
    leaders.forEach((leader, index) => {
      players += `${index + 1}. ${leader.username} - ${leader.score} очков\n`;
    });

    scene.add
      .text(width / 2, height / 3, players, {
        font: "24px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.1);
  }

  create(data) {
    this.add.image(400, 300, "sky");

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.displayLeaders(this, data.players);

    const scoreText = this.add
      .text(width / 2, height / 1.5, `Вы набрали: ${data.score} очков!`, {
        fontSize: "32px",
        fill: "#000",
      })
      .setOrigin(0.5, 0.5);

    const restartButton = this.add
      .text(width / 2, height / 1.2, "Играть снова", {
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
