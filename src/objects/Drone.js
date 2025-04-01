export default class Drone extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "drone"); // 'drone' — это ключ спрайта

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.speed = 150;
    this.avoidDistance = 80; // Дистанция обхода препятствий
    this.maxSteer = 8; // Ограничение на изменение вектора движения
    this.velocity = new Phaser.Math.Vector2(
      Phaser.Math.Between(-100, 100),
      Phaser.Math.Between(-100, 100)
    );
    this.acceleration = new Phaser.Math.Vector2(0, 0);

    // Переключатель для анимации
    this.isRed = true; // Красная лампа изначально
    this.timeToSwitch = 0; // Время для переключения
  }

  update(time, delta) {
    // Получаем игрока и препятствия
    let player = this.scene.player; // Предполагаем, что у нас есть игрок
    let obstacles = this.scene.platforms.getChildren(); // Платформы как объекты

    this.seek(player); // Преследовать игрока
    this.avoidObstacles(obstacles, delta); // Избегать препятствий

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.speed); // Ограничиваем скорость

    this.x += this.velocity.x * (delta / 1000); // Применяем delta для времени
    this.y += this.velocity.y * (delta / 1000); // Применяем delta для времени

    this.acceleration.set(0, 0); // Сбрасываем ускорение

    // Переключаем анимацию лампы по таймеру
    this.timeToSwitch -= delta;
    if (this.timeToSwitch <= 0) {
      this.timeToSwitch = Phaser.Math.Between(500, 1500); // Случайный интервал для переключения
      this.isRed = !this.isRed; // Переключаем состояние лампы

      // Выбираем анимацию в зависимости от состояния лампы
      if (this.isRed) {
        this.anims.play("droneRedBlink", true); // Включаем анимацию красной лампы
      } else {
        this.anims.play("droneBlueBlink", true); // Включаем анимацию синей лампы
      }
    }
  }

  // Преследование игрока
  seek(target) {
    if (!target) return;

    let desired = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y);
    desired.normalize().scale(this.speed);

    let steer = desired.subtract(this.velocity);
    steer.limit(this.maxSteer); // Ограничиваем силу отклонения

    this.acceleration.add(steer);
  }

  // Избегание препятствий
  avoidObstacles(obstacles, delta) {
    let avoidance = new Phaser.Math.Vector2(0, 0); // Вектор для избегания

    obstacles.forEach((obstacle) => {
      // Проверка расстояния до препятствия
      let dist = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        obstacle.x,
        obstacle.y
      );
      if (dist < this.avoidDistance) {
        // Рассчитываем направление для избегания столкновения
        let avoidDir = new Phaser.Math.Vector2(
          this.x - obstacle.x,
          this.y - obstacle.y
        );
        avoidDir.normalize(); // Нормализуем вектор
        avoidDir.scale(1 / dist); // Увеличиваем силу избегания, чем ближе к препятствию

        // Корректируем направление
        avoidance.add(avoidDir);
      }
    });

    // Применяем изменения на основании избегания
    if (avoidance.length() > 0) {
      avoidance.normalize().scale(this.speed); // Нормализуем и масштабируем
      this.acceleration.add(avoidance); // Применяем ускорение на основе избегания
    }
  }
}
