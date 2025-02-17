import Phaser from "phaser";
import EventEmitter from "../utils/eventEmmiter";
import GameManager from "../utils/gameManager";

export default class GameOverLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style) {
    // super(scene, x, y, text, style);
    // this.add
    //   .text(390, 250, "Играть снова", {
    //     fontSize: "32px",
    //     fill: "#000",
    //   })
    //   .setOrigin(0.5)
    //   .setInteractive()
    //   .on("pointerover", () => {
    //     restartButton.setScale(0.9);
    //   })
    //   .on("pointerout", () => {
    //     restartButton.setScale(1);
    //   })
    //   .on("pointerdown", () => {
    //     GameManager.updateShouldRestart(true);
    //   });

    // if (GameManager.getGameOver()) {
    //   scene.add.existing(this);
    // }
    // EventEmitter.on("onGameOverChange", () => this.updateLabel());
  }

  updateLabel() {
    if (GameManager.getGameOver()) {
      this.scene.add.existing(this);
    }
  }
}
