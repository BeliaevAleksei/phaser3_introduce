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

  // let jumpHeight = 200;

  const gameMap = generatePlatforms();
  addPlatformsToScene(scene, gameMap);
}

function addPlatformsToScene(scene, gameMap) {
  const gameWidth = scene.sys.game.config.width;
  const gameHeight = scene.sys.game.config.height;

  const platformWidth = gameWidth / 10;
  const platformHeight = (gameHeight - 25) / 10;

  for (let i = 0; i < gameMap.length; i++) {
    let currntPlatformCellWidth = 0;

    for (let j = 0; j < gameMap[i].length; j++) {
      if (gameMap[i][j] === 1) {
        currntPlatformCellWidth += 1;
      }

      if (gameMap[i][j] === 0 || j === gameMap[i].length - 1) {
        if (currntPlatformCellWidth > 0) {
          let endCol = gameMap[i][j] === 1 ? j : j - 1;
          let x =
            (endCol - currntPlatformCellWidth + 1) * platformWidth +
            (platformWidth * currntPlatformCellWidth) / 2;
          let y = i * platformHeight + platformHeight / 2;

          let platform = scene.platforms.create(x, y, "platform");
          platform.displayHeight = platformHeight / 2;
          platform.displayWidth = platformWidth * currntPlatformCellWidth;
          platform.refreshBody();
          scene.platforms.add(platform);

          currntPlatformCellWidth = 0;
        }
      }
    }
  }
}

/**
 * Generate game map sector for future usage.
 * The base logic is to split fields into random chessboard and return simplify sector map:
 * @param {nubmer} gameLevel - future: use for generate different difficulty level
 * @returns {number[][]} - Return sectors game map 1 - platform sector, 0 - empty sector
 */
// xxx xxx xxx x    0 0 0 0
// lll xxx lll x => 1 0 1 0
// xxx lll xxx l    0 1 0 1
function generateMapSectors(gameLevel) {
  const countSectorsPerRow = 4;
  const countSectorsPerColumn = 5;

  const gameSectorsMap = Array.from({ length: countSectorsPerColumn }, () =>
    Array(countSectorsPerRow).fill(0)
  );

  const skipRowSectorIndexes = [0];
  // TODO:  add skip last on high level
  const isStartFromEdge = Phaser.Math.Between(0, 1);

  for (let y = 0; y < countSectorsPerColumn; y++) {
    if (skipRowSectorIndexes.includes(y)) {
      for (let x = 0; x < countSectorsPerRow; x++) {
        gameSectorsMap[y][x] = 0;
      }
      continue;
    }

    for (let x = 0; x < countSectorsPerRow; x++) {
      gameSectorsMap[y][x] = (x + y) % 2 === isStartFromEdge ? 1 : 0;
    }
  }

  return gameSectorsMap;
}

/**
 * Marks out the game level to accomodate sector-based platforms.
 * @param {*} gameMapSectors - sectors game map
 * @param {*} gameMap - game map for platforms
 * @returns
 */
function fillMapBySectors(gameMapSectors, gameMap) {
  const maxSectorSizeX = 3;
  const maxSetorSizeY = 2;

  for (let y = 0; y < gameMapSectors.length; y++) {
    const countSectorsPerRow = gameMapSectors[y].length;

    for (let x = 0; x < countSectorsPerRow; x++) {
      let startSectorPlatformPositionY = Phaser.Math.Between(0, 1);

      if (y === gameMapSectors.length - 1) {
        startSectorPlatformPositionY = 0;
      }

      if (gameMapSectors[y][x] === 1) {
        if (x === countSectorsPerRow - 1) {
          gameMap[y * maxSetorSizeY][x * maxSectorSizeX] = 1;
        } else {
          const platformSize = Phaser.Math.Between(1, maxSectorSizeX);
          const startSectorPlatformPositionX =
            platformSize < maxSectorSizeX
              ? platformSize === 1
                ? 1
                : Phaser.Math.Between(0, maxSectorSizeX - platformSize)
              : 0;
          for (let i = 0; i < platformSize; i++) {
            gameMap[y * maxSetorSizeY + startSectorPlatformPositionY][
              x * maxSectorSizeX + startSectorPlatformPositionX + i
            ] = 1;
          }
        }
      }
    }
  }
}

/**
 * Randomly removes platforms that are adjacent diagonelly.
 * @param {*} gameMap - game map for platforms
 */
function removeAdjacentPlatform(gameMap) {
  const directions = [
    [-1, -1], // top left
    // [-1, 0], // top
    [-1, 1], // top right
    // [0, -1], // left
    // [0, 1], // right
    [1, -1], // bottom left
    // [1, 0], // bottom
    [1, 1], // bottom right
  ];

  for (let i = 0; i < gameMap.length; i++) {
    for (let j = 0; j < gameMap[i].length; j++) {
      if (gameMap[i][j] === 1) {
        for (let [dx, dy] of directions) {
          const gy = i + dx;
          const gx = j + dy;
          if (
            gy >= 0 &&
            gy < gameMap.length &&
            gx >= 0 &&
            gx < gameMap[i].length &&
            gameMap[gy][gx] === 1
          ) {
            const shouldDeleteCurrentPlatform = Phaser.Math.Between(0, 1);
            if (shouldDeleteCurrentPlatform) {
              gameMap[i][j] = 0;
            } else {
              gameMap[gy][gx] = 0;
            }
          }
        }
      }
    }
  }
}

function generatePlatforms() {
  const gameMapSize = 10;
  const gameMap = Array.from({ length: gameMapSize }, () =>
    Array(gameMapSize).fill(0)
  );

  const gameMapSectors = generateMapSectors();
  fillMapBySectors(gameMapSectors, gameMap);
  removeAdjacentPlatform(gameMap);

  return gameMap;
}
