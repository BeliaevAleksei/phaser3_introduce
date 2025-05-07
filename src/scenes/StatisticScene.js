import { Scene } from "phaser";

export default class StatisticScene extends Scene {
  constructor() {
    super({ key: "StatisticScene" });
  }

  restart() {
    this.backgroundRect?.destroy();

    if (this.game.scene.getScene("GameScene")) {
      this.game.scene.remove("GameScene");
    }

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

  preload() {}

  displayLeaders(scene, leaders) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const text = "Топ 5 накрутчиков (осуждаем)";
    scene.add
      .text(width / 2, height / 3 - 35, text, {
        fontFamily: "PixelCyr",
        fontSize: "24px",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 1);

    let players = "";
    leaders.forEach((leader, index) => {
      players += `${index + 1}. ${leader.username} - ${leader.score} очков\n`;
    });

    scene.add
      .text(width / 2, height / 3, players, {
        fontFamily: "PixelCyr",
        fontSize: "24px",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.1);
  }

  create(data) {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    this.backgroundRect = this.add
      .rectangle(0, 0, gameWidth, gameHeight, 0x000000)
      .setOrigin(0, 0);

    this.displayLeaders(this, data.players);

    const scoreText = this.add
      .text(
        gameWidth / 2,
        gameHeight / 1.5,
        `Вы набрали: ${data.score} очков!`,
        {
          fontFamily: "PixelCyr",
          fontSize: "32px",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5, 0.5);

    const restartButton = this.add
      .text(gameWidth / 2, gameHeight / 1.2, "> Играть снова <", {
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
        this.restart();
      });
  }

  update() {}
}
