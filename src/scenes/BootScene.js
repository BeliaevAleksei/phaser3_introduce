import { Scene } from "phaser";

export default class BootScene extends Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  create() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    this.backgroundRect = this.add
      .rectangle(0, 0, gameWidth, gameHeight, 0x000000)
      .setOrigin(0, 0);

    const centerX = gameWidth / 2;
    let startY = gameHeight / 3;
    let offset = 80;

    document.fonts.ready.then(() => {
      this.add
        .text(centerX, startY, "18+", {
          fontFamily: "PixelCyr",
          fontSize: "48px",
          fontWeight: "bold",
          color: "#ff0000",
        })
        .setOrigin(0.5, 0);

      this.add
        .text(
          centerX,
          startY + offset,
          "Данная игра не пропагандирует курение.",
          {
            fontFamily: "PixelCyr",
            fontSize: "24px",
            color: "#ffffff",
          }
        )
        .setOrigin(0.5, 0);

      this.add
        .text(
          centerX,
          startY + offset * 2,
          "Все упоминания табачных изделий носят исключительно\n\nхудожественный и вымышленный характер.",
          {
            fontFamily: "PixelCyr",
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
          }
        )
        .setOrigin(0.5, 0)
        .setWordWrapWidth(600);

      this.add
        .text(centerX, startY + offset * 4, "Курение вредит вашему здоровью", {
          fontFamily: "PixelCyr",
          fontSize: "20px",
          color: "#ff4444",
        })
        .setOrigin(0.5, 0);
    });

    Promise.all([
      new Promise((res) => {
        setTimeout(() => {
          res("good");
        }, 2500);
      }),
      import("./GameScene"),
    ]).then((res) => {
      this.backgroundRect?.destroy();
      const GameScene = res[1].default;
      this.scene.add("GameScene", GameScene);
      this.scene.start("GameScene");
    });
  }
}
