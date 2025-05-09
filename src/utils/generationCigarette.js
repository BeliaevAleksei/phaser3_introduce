export function generateCigarettes(scene, scale) {
  const randomizedCigarettes = randomizer(
    scene.platforms?.children?.entries?.length || 0,
    3
  );

  scene.platforms.children.iterate((platform, i) => {
    if (randomizedCigarettes[i]) {
      const x = platform.x;
      const y = platform.y - 80;

      const cigarette = scene.cigarettes.create(x, y, "cigarette");
      cigarette.body.allowGravity = false;
      console.log("DDL scale", scale);
      cigarette.setScale(scale * 0.7);

      const glowCircle = scene.add.graphics();
      glowCircle.fillStyle(0xffffff, 0.5);
      glowCircle.fillCircle(0, 0, 50 * scale * 0.7);
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
}

function randomizer(max, min) {
  if (min > max) {
    throw new Error("m не может быть больше n");
  }

  const unitsNumber = Phaser.Math.Between(min, Math.floor(max / 2));
  let result = Array(unitsNumber)
    .fill(1)
    .concat(Array(max - unitsNumber).fill(0));
  result = result.sort(() => Math.random() - 0.5);

  return result;
}
