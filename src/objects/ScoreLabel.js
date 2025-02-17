import Phaser from "phaser";
import EventEmitter from "../utils/eventEmmiter";
import GameManager from "../utils/gameManager";

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, style) {
    super(scene, x, y, `Score: ${GameManager.getScore()}`, style);
    scene.add.existing(this);
    EventEmitter.on("onScoreChange", () => this.updateLabel());
  }

  updateLabel() {
    this.setText(`Score: ${GameManager.getScore()}`);
  }
}
