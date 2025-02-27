import Phaser from "phaser";

export default class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bomb");
    scene.add.existing(this);
    scene.physics.world.enable(this);

    // this.setBounce(1);
    // this.setCollideWorldBounds(true);
    // this.setVelocity(Phaser.Math.Between(-200, 200), 20);
    // this.setGravityY(400);
  }
}
