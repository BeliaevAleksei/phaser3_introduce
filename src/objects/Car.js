export default class Car extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "car");

    scene.add.existing(this);

    this.setScale(scene.scale * 0.7);
  }

  update(time, delta) {}

  move() {
    // this.setVelocityX(400);
    this.play("carDrive");
  }

  stop() {
    // this.setVelocityX(0);
    this.play("carWait");
  }
}
