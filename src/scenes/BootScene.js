import { Scene } from "phaser";

export default class BootScene extends Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
  }

  create() {
    this.add.image(400, 300, "sky");

    import("./GameScene").then((module) => {
      const GameScene = module.default;
      this.scene.add("GameScene", GameScene);
      this.scene.start("GameScene");
    });
  }
}
