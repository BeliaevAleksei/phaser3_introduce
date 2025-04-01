import { Scene } from "phaser";

export default class UnsupportMobileScene extends Scene {
  constructor() {
    super({ key: "UnsupportMobileScene" });
  }

  create() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    this.backgroundRect = this.add
      .rectangle(0, 0, gameWidth, gameHeight, 0x000000)
      .setOrigin(0, 0);

    const centerX = gameWidth / 2;
    let startY = gameHeight / 3;

    document.fonts.ready.then(() => {
      this.add
        .text(
          centerX,
          startY,
          "На текущий момент \n\nигра не поддерживает \n\nмобильные устройства. \n\n;(",
          {
            fontFamily: "PixelCyr",
            fontSize: "32px",
            color: "#ffffff",
          }
        )
        .setOrigin(0.5, 0);
    });
  }
}
