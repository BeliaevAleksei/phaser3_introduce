import { Scene } from "phaser";

export default class StartScene extends Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  start() {
    this.backgroundRect?.destroy();

    // if (this.game.scene.getScene("GameScene")) {
    //   this.game.scene.remove("GameScene");
    // }

    import(`./GameScene.js`)
      .then((module) => {
        const SceneClass = module.default;
        this.scene.add("GameScene", SceneClass);
        this.scene.start("GameScene", { score: this.score });
      })
      .catch((err) => {
        console.error("Ошибка загрузки сцены:", err);
      });
  }

  create() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    this.backgroundRect = this.add
      .rectangle(0, 0, gameWidth, gameHeight, 0x000000)
      .setOrigin(0, 0);

    const restartButton = this.add
      .text(gameWidth / 2, gameHeight / 1.2, "> Играть <", {
        fontFamily: "PixelCyr",
        fontSize: "32px",
        fill: "#ffffff",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => {
        restartButton.setScale(0.9);
      })
      .on("pointerout", () => {
        restartButton.setScale(1);
      })
      .on("pointerdown", () => {
        this.start();
      });
  }
}
