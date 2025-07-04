export default class Car extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Спавн в центре платформы по x, чуть выше по y
    super(scene, x, y, "car");

    scene.add.existing(this);
    // scene.physics.add.existing(this);
    // this.body.setAllowGravity(false);

    this.setScale(scene.scale * 0.7);
  }

  update(time, delta) {}

  move() {
    // this.setVelocityX(400);
    this.play("car-drive");
  }

  stop() {
    // this.setVelocityX(0);
    this.play("car-wait");
  }
}
