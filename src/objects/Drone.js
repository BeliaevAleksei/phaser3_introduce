export default class Drone extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, platform) {
    // Спавн в центре платформы по x, чуть выше по y
    super(scene, platform.x, platform.y - 80, "drone"); // выше платформы

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);

    this.scene = scene;
    this.platform = platform;
    this.speed = 60;
    this.direction = 1;

    this.startX = platform.getTopLeft().x + 20;
    this.endX = platform.getTopRight().x - 20;

    this.setX(this.startX);

    // Мерцание
    this.isRed = true;
    this.timeToSwitch = 0;

    // Параметры покачивания
    this.baseY = this.y;
    this.waveAmplitude = 5;
    this.waveSpeed = 0.0015; // медленнее волна
    this.elapsed = 0;
  }

  update(time, delta) {
    // Горизонтальное движение
    this.x += this.direction * this.speed * (delta / 1000);

    if (this.x >= this.endX) {
      this.x = this.endX;
      this.direction = -1;
    } else if (this.x <= this.startX) {
      this.x = this.startX;
      this.direction = 1;
    }

    this.elapsed += delta;
    this.y =
      this.baseY + Math.sin(this.elapsed * this.waveSpeed) * this.waveAmplitude;

    // Мерцание лампы
    this.timeToSwitch -= delta;
    if (this.timeToSwitch <= 0) {
      this.timeToSwitch = Phaser.Math.Between(500, 1500);
      this.isRed = !this.isRed;

      if (this.isRed) {
        this.anims.play("droneRedBlink", true);
      } else {
        this.anims.play("droneBlueBlink", true);
      }
    }
  }
}
