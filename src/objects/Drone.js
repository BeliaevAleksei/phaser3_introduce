export default class Drone extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "drone");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 120; // Скорость движения
    this.aggroRange = 150; // Радиус агрессии
    this.state = "PATROL"; // Состояния: PATROL, CHASE, RETURN

    // Патрульные точки
    this.waypoints = [
      { x: 100, y: 100 },
      { x: 600, y: 300 },
      { x: 300, y: 500 },
    ];
    this.currentWaypoint = 0;
    this.target = this.waypoints[this.currentWaypoint];

    // Таймер уклонения (если застрянет)
    this.evadeTime = 0;

    this.isRedLight = true; // Красная лампа изначально
    this.timeToSwitch = 0; // Время для переключения
  }

  update(time, delta) {
    let player = this.scene.player; // Игрок

    // Проверяем, находится ли игрок в радиусе
    if (
      Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <
      this.aggroRange
    ) {
      this.state = "CHASE";
      this.target = { x: player.x, y: player.y };
    } else if (this.state === "CHASE") {
      this.state = "RETURN";
      this.target = this.waypoints[this.currentWaypoint];
    }

    // Если дрон достиг патрульной точки — берём следующую
    if (
      (this.state === "PATROL" || this.state === "RETURN") &&
      Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.target.x,
        this.target.y
      ) < 10
    ) {
      this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
      this.target = this.waypoints[this.currentWaypoint];
    }

    this.timeToSwitch -= delta;
    if (this.timeToSwitch <= 0) {
      this.timeToSwitch = Phaser.Math.Between(500, 1500); // Случайный интервал для переключения
      this.isRedLight = !this.isRedLight; // Переключаем состояние лампы

      // Выбираем анимацию в зависимости от состояния лампы
      if (this.isRedLight) {
        this.anims.play("droneRedBlink", true); // Включаем анимацию красной лампы
      } else {
        this.anims.play("droneBlueBlink", true); // Включаем анимацию синей лампы
      }
    }

    this.avoidObstacles(delta);
    this.moveToTarget();
  }

  moveToTarget() {
    let angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );
    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
  }

  avoidObstacles(delta) {
    // Если дрон столкнулся с чем-то — меняем траекторию
    if (this.body.blocked.left || this.body.blocked.right) {
      this.setVelocityX(-this.body.velocity.x);
    }
    if (this.body.blocked.up || this.body.blocked.down) {
      this.setVelocityY(-this.body.velocity.y);
    }

    // Если дрон застрял, добавляем случайное уклонение
    this.evadeTime += delta;
    if (this.evadeTime > 2000) {
      // Каждые 2 секунды проверяем
      this.evadeTime = 0;
      this.setVelocity(
        Phaser.Math.Between(-100, 100),
        Phaser.Math.Between(-100, 100)
      );
    }
  }
}

// export default class Drone extends Phaser.Physics.Arcade.Sprite {
//   constructor(scene, x, y) {
//     super(scene, x, y, "drone");

//     scene.add.existing(this);
//     scene.physics.add.existing(this);

//     this.scene = scene;
//     this.speed = 150;
//     this.avoidDistance = 80;
//     this.maxSteer = 8; // Ограничение на изменение вектора движения
//     this.velocity = new Phaser.Math.Vector2(
//       Phaser.Math.Between(-100, 100),
//       Phaser.Math.Between(-100, 100)
//     );
//     this.acceleration = new Phaser.Math.Vector2(0, 0);

//     this.isRedLight = true; // Красная лампа изначально
//     this.timeToSwitch = 0; // Время для переключения
//   }

//   update(time, delta) {
//     // Получаем игрока и препятствия
//     let player = this.scene.player; // Предполагаем, что у нас есть игрок
//     let obstacles = this.scene.platforms.getChildren(); // Платформы как объекты

//     this.seek(player); // Преследовать игрока
//     this.avoidObstacles(obstacles, delta); // Избегать препятствий

//     this.velocity.add(this.acceleration);
//     this.velocity.limit(this.speed); // Ограничиваем скорость

//     this.x += this.velocity.x * (delta / 1000); // Применяем delta для времени
//     this.y += this.velocity.y * (delta / 1000); // Применяем delta для времени

//     this.acceleration.set(0, 0); // Сбрасываем ускорение

//     // Переключаем анимацию лампы по таймеру
//     this.timeToSwitch -= delta;
//     if (this.timeToSwitch <= 0) {
//       this.timeToSwitch = Phaser.Math.Between(500, 1500); // Случайный интервал для переключения
//       this.isRedLight = !this.isRedLight; // Переключаем состояние лампы

//       // Выбираем анимацию в зависимости от состояния лампы
//       if (this.isRedLight) {
//         this.anims.play("droneRedBlink", true); // Включаем анимацию красной лампы
//       } else {
//         this.anims.play("droneBlueBlink", true); // Включаем анимацию синей лампы
//       }
//     }
//   }

//   // Преследование игрока
//   seek(target) {
//     if (!target) return;

//     let desired = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y);
//     desired.normalize().scale(this.speed);

//     let steer = desired.subtract(this.velocity);
//     steer.limit(this.maxSteer); // Ограничиваем силу отклонения

//     this.acceleration.add(steer);
//   }

//   // Избегание препятствий
//   avoidObstacles(obstacles, delta) {
//     let avoidance = new Phaser.Math.Vector2(0, 0); // Вектор для избегания

//     obstacles.forEach((obstacle) => {
//       // Проверка расстояния до препятствия
//       let dist = Phaser.Math.Distance.Between(
//         this.x,
//         this.y,
//         obstacle.x,
//         obstacle.y
//       );
//       if (dist < this.avoidDistance) {
//         // Рассчитываем направление для избегания столкновения
//         let avoidDir = new Phaser.Math.Vector2(
//           this.x - obstacle.x,
//           this.y - obstacle.y
//         );
//         avoidDir.normalize(); // Нормализуем вектор
//         avoidDir.scale(1 / dist); // Увеличиваем силу избегания, чем ближе к препятствию

//         // Корректируем направление
//         avoidance.add(avoidDir);
//       }
//     });

//     // Применяем изменения на основании избегания
//     if (avoidance.length() > 0) {
//       avoidance.normalize().scale(this.speed); // Нормализуем и масштабируем
//       this.acceleration.add(avoidance); // Применяем ускорение на основе избегания
//     }
//   }
// }
