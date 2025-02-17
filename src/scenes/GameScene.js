import Phaser from "phaser";
import Player from "../objects/Player.js";
import Platform from "../objects/Platform.js";
import ScoreLabel from "../objects/ScoreLabel.js";
import Bomb from "../objects/Bomb.js";
import GameManager from "../utils/gameManager.js";
import GameOverLabel from "../objects/GameOverLabel.js";
import EventEmitter from "../utils/eventEmmiter.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
    this.load.image("ground", "./assets/platform.png");
    this.load.image("star", "./assets/star.png");
    this.load.image("bomb", "./assets/bomb.png");
    this.load.spritesheet("dude", "./assets/dude.png", {
      frameWidth: 32,
      frameHeight: 44,
    });

    if (this.sys.game.device.os.desktop) {
      GameManager.updateIsDesktop(true);
    } else {
      GameManager.updateIsDesktop(false);
    }

    if (!GameManager.getIsDesktop()) {
      this.load.plugin(
        "rexvirtualjoystickplugin",
        "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
        true
      );
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    GameManager.incrementScore(10);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
  }

  spawnBomb() {
    var x =
      this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
    const bomb = new Bomb(this, x, 16);
    this.bombs.add(bomb);
    bomb.setBounce(1); // fix that
    bomb.setCollideWorldBounds(true); // fix that
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); // fix that
    bomb.setGravityY(200); // fix that
  }

  gameOver() {
    if (GameManager.getGameOver()) {
      this.physics.pause();
    }
  }

  restart() {
    if (GameManager.getShouldRestart()) {
      GameManager.updateGameOver(false);
      GameManager.updateScore(0);
      GameManager.updateShouldRestart(false);
      EventEmitter.clear();
      this.physics.start();
      this.scene.restart();
    }
  }

  hitBomb(player, bomb) {
    player.setTint(0xff0000);
    player.anims.play("turn");
    GameManager.updateGameOver(true);

    const restartButton = this.add
      .text(390, 250, "Играть снова", {
        fontSize: "32px",
        fill: "#000",
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
        GameManager.updateShouldRestart(true);
      });

    if (GameManager.getGameOver()) {
      this.add.existing(this);
    }
  }

  create() {
    this.add.image(400, 300, "sky");

    this.platforms = this.physics.add.staticGroup();
    const platform1 = new Platform(this, 400, 568, "ground")
      .setScale(2)
      .refreshBody();
    const platform2 = new Platform(this, 600, 400, "ground");
    const platform3 = new Platform(this, 50, 250, "ground");
    const platform4 = new Platform(this, 750, 220, "ground");
    this.platforms.add(platform1);
    this.platforms.add(platform2);
    this.platforms.add(platform3);
    this.platforms.add(platform4);

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.player = new Player(this, 100, 450);

    this.bombs = this.physics.add.group();

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    this.scroreLabel = new ScoreLabel(this, 16, 16, 0, {
      fontSize: "32px",
      fill: "#000",
    });
    // this.gameOverLabel = new GameOverLabel(this, 190, 160, "GAME OVER", {
    //   fontSize: "64px",
    //   fill: "#000",
    // });

    if (!GameManager.getIsDesktop()) {
      joystick1 = this.plugins
        .get("rexvirtualjoystickplugin")
        .add(this, {
          x: this.scale.width - 150,
          y: this.scale.height - 150,
          radius: 80,
          base: this.add.circle(0, 0, 80, 0x888888),
          thumb: this.add.circle(0, 0, 40, 0xffffff),
          dir: 2,
        })
        .on("update", () => {
          if (joystick1.up && this.player.body.touching.down) {
            this.player.setVelocityY(jumpPower);
            this.player.isJumping = true;
          }
        });
    }

    this.spawnBomb();
    EventEmitter.on("onGameOverChange", () => this.gameOver());
    EventEmitter.on("onShouldRestartChange", () => this.restart());
  }

  update() {
    if (GameManager.getGameOver()) {
      return;
    }
    this.player.update();
  }
}
