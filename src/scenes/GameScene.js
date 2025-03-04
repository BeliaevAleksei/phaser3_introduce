import Phaser from "phaser";
import Player from "../objects/Player.js";
import Platform from "../objects/Platform.js";
import ScoreLabel from "../objects/ScoreLabel.js";
import Bomb from "../objects/Bomb.js";
import GameManager from "../utils/gameManager.js";
import EventEmitter from "../utils/eventEmmiter.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import wsService from "../services/WebSocketService.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
    this.load.image("ground", "./assets/platform.png");
    this.load.image("star", "./assets/star.png");
    this.load.image("bomb", "./assets/bomb.png");
    this.load.spritesheet("dude", "./assets/dude.png?v=2", {
      frameWidth: 24,
      frameHeight: 43,
      spacing: 5,
    });

    if (this.sys.game.device.os.desktop) {
      GameManager.updateIsDesktop(true);
    } else {
      GameManager.updateIsDesktop(false);
    }

    if (!GameManager.getIsDesktop()) {
      this.load.plugin("rexvirtualjoystickplugin", VirtualJoystickPlugin, true);
    }
  }

  updateScore(score) {
    this.score = score;
    this.scroreLabel.updateLabel(score)
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.updateScore(this.score + 10);
    wsService.send({ action: "update_score", score: GameManager.score });

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        child.enableBody(
          true,
          child.x,
          Phaser.Math.Between(0, this.scale.height - 200),
          true,
          true
        );
      });
      this.spawnBomb();
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
    let angle = Phaser.Math.Between(30, 150);
    let speed = 200; // fix that
    this.physics.velocityFromAngle(angle, speed, bomb.body.velocity); // fix that
    bomb.setGravityY(200); // fix that
  }

  gameOver() {
    // this.physics.pause();
    EventEmitter.clear();
    this.scene.start("GameOverScene", { score: this.score });
  }

  hitBomb(player, bomb) {
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.gameOver();
  }

  create() {
    wsService.connect();
    this.score = 0;
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
      setXY: {
        x: 12,
        y: Phaser.Math.Between(0, this.scale.displaySize.height),
        stepX: 70,
      },
    });
    this.stars.children.iterate((child) => {
      child.y = Phaser.Math.Between(0, this.scale.height - 200);
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

    if (!GameManager.getIsDesktop()) {
      this.joystick1 = this.plugins.get("rexvirtualjoystickplugin").add(this, {
        x: this.scale.width - 110,
        y: this.scale.height - 110,
        radius: 80,
        base: this.add.circle(0, 0, 80, 0x888888),
        thumb: this.add.circle(0, 0, 40, 0xffffff),
        dir: 2,
      });
    }

    this.spawnBomb();
    EventEmitter.on("onGameOverChange", () => this.gameOver());
  }

  update() {
    if (GameManager.getGameOver()) {
      return;
    }
    this.player.update();
  }
}
