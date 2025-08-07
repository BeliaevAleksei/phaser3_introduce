export default class Megumin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "megumin");

    scene.add.existing(this);
    this.meguminCastSound = this.scene.sound.add("meguminExplosion", {
      loop: false,
      volume: 1,
    });
    this.setScale(scene.scale * 0.7);
  }

  update(time, delta) {}

  castSpell() {
    // this.setVelocityX(400);
    this.meguminCastSound.play();

    this.play("meguminCast1"); // Первая анимация сразу

    // Запуск остальных анимаций по таймеру
    this.scene.time.delayedCall(5000, () => {
      this.play("meguminCast2");
    });

    this.scene.time.delayedCall(8000, () => {
      this.play("meguminCast3");
    });
  }

  stop() {
    // this.setVelocityX(0);
    this.play("carWait");
  }
}
