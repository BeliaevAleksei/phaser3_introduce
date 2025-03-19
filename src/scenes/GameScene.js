import { Scene } from "phaser";
import Player from "../objects/Player.js";
import Platform from "../objects/Platform.js";
import ScoreLabel from "../objects/ScoreLabel.js";
import Bomb from "../objects/Bomb.js";
import GameManager from "../utils/gameManager.js";
import EventEmitter from "../utils/eventEmmiter.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import wsService from "../services/WebSocketService.js";
import { generateLevel } from "../utils/platformGeneration.js";

export default class GameScene extends Scene {
  constructor() {
    super({ key: "GameScene" });
    this.isGameOver = false;
  }

  preload() {
    this.load.image("sky2", "./assets/night-city.png");
    this.load.image("platform", "./assets/night-platform.png");
    this.load.image("ground", "./assets/night-ground-platform.png");
    this.load.image("star", "./assets/star.png");
    this.load.image("bomb", "./assets/bomb.png");
    this.load.image("cigarette", "./assets/cigarette.png");
    this.load.image("particle", "./assets/sigarete-practicle.png");
    this.load.spritesheet("dude", "./assets/dude-2.png?v=1", {
      frameWidth: 81,
      frameHeight: 94,
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
    this.scroreLabel.updateLabel(score);
    wsService.send({ action: "update_score" });
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.updateScore(this.score + 10);

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
    EventEmitter.clear();
    if (this.game.scene.getScene("GameOverScene")) {
      this.scene.start("GameOverScene", { score: this.score });
      return;
    }

    import(`./GameOverScene.js`)
      .then((module) => {
        const SceneClass = module.default;
        this.scene.add("GameOverScene", SceneClass);
        this.scene.start("GameOverScene", { score: this.score });
      })
      .catch((err) => {
        console.error("Ошибка загрузки сцены:", err);
      });
  }

  hitBomb(player, bomb) {
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.isGameOver = true;
    this.gameOver();
  }

  create() {
    wsService.connect();
    this.score = 0;
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    const bg = this.add.image(0, 0, "sky2").setOrigin(0, 0);
    bg.displayWidth = gameWidth;
    bg.displayHeight = gameHeight;
    this.cigarettes = this.physics.add.group();

    // this.stars = this.physics.add.group({
    //   key: "star",
    //   repeat: 11,
    //   setXY: {
    //     x: 12,
    //     y: Phaser.Math.Between(0, this.scale.displaySize.height),
    //     stepX: 70,
    //   },
    // });
    // this.stars.children.iterate((child) => {
    //   child.y = Phaser.Math.Between(0, this.scale.height - 200);
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    // });

    this.player = new Player(this, 100, 450);
    this.platforms = this.physics.add.staticGroup();
    const ground = this.physics.add.staticImage(
      gameWidth / 2,
      gameHeight - 12,
      "ground"
    );
    ground.displayWidth = gameWidth;
    ground.refreshBody();
    this.platforms.add(ground);

    generateLevel({ scene: this });

    this.bombs = this.physics.add.group();

    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );

    this.physics.add.collider(this.player, this.platforms);
    // this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    // this.physics.add.overlap(
    //   this.player,
    //   this.stars,
    //   this.collectStar,
    //   null,
    //   this
    // );
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

    // this.spawnBomb();
  }

  update() {
    if (this.isGameOver) {
      return;
    }
    this.player.update();
  }
}
