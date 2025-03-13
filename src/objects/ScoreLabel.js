import { GameObjects } from "phaser";

export default class ScoreLabel extends GameObjects.Text {
  constructor(scene, x, y, score, style) {
    super(scene, x, y, `Score: ${score}`, style);
    scene.add.existing(this);
  }

  updateLabel(score) {
    this.setText(`Score: ${score}`);
  }
}
