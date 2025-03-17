const gameMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export function generateLevel({
  scene,
  platformCount = 10,
  texture = "platform",
  difficulty = "easy",
}) {
  if (!scene.platforms) {
    console.error("Ошибка: платформа не инициализирована!");
    return;
  }

  const gameWidth = scene.sys.game.config.width;
  const gameHeight = scene.sys.game.config.height;

  // let platformWidth = 285;
  // let platformHeight = 55;

  const platformWidth = gameWidth / 10;
  const platformHeight = (gameHeight - 25) / 10;

  // let jumpHeight = 200;

  gameMap.forEach((row, indexRow) => {
    let currntPlatformCellWidth = 0;

    row.forEach((col, indexCol) => {
      if (col === 1) {
        currntPlatformCellWidth += 1;
      }

      if (col === 0 || indexCol === row.length - 1) {
        if (currntPlatformCellWidth > 0) {
          let endCol = col === 1 ? indexCol : indexCol - 1;
          let x =
            (endCol - currntPlatformCellWidth + 1) * platformWidth +
            (platformWidth * currntPlatformCellWidth) / 2;
          let y = indexRow * platformHeight + platformHeight / 2;

          let platform = scene.platforms.create(x, y, "platform");
          platform.displayHeight = platformHeight / 2;
          platform.displayWidth = platformWidth * currntPlatformCellWidth;
          platform.refreshBody();

          currntPlatformCellWidth = 0;
        }
      }
    });
  });

  generateCigarettes(scene);

  if (scene.player) {
    scene.physics.add.collider(scene.player, scene.platforms);
  } else {
    console.error("Ошибка: игрок не создан!");
  }
}

function collectStar() {}

function generateCigarettes(scene) {
  scene.platforms.children.iterate((platform) => {
    if (Phaser.Math.Between(0, 1)) {
      const x = platform.x;
      const y = platform.y - 80;

      const cigarette = scene.cigarettes.create(x, y, "cigarette");
      cigarette.body.allowGravity = false;

      const glowCircle = scene.add.graphics();
      glowCircle.fillStyle(0xffffff, 0.5);
      glowCircle.fillCircle(0, 0, 50);
      glowCircle.setPosition(cigarette.x, cigarette.y);

      scene.tweens.add({
        targets: glowCircle,
        alpha: { from: 0.5, to: 0 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      cigarette.glowCircle = glowCircle;
    }
  });

  scene.physics.add.collider(scene.cigarettes, scene.platforms);
  scene.physics.add.overlap(
    scene.player,
    scene.cigarettes,
    collectStar,
    null,
    scene
  );
}
