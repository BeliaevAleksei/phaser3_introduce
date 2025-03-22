export function generateCigarettes(scene) {
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
}
