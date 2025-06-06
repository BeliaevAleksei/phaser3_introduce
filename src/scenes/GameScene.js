import { Scene } from "phaser";
import Player from "../objects/Player.js";
import ScoreLabel from "../objects/ScoreLabel.js";
import Drone from "../objects/Drone.js";
import GameManager from "../utils/gameManager.js";
import EventEmitter from "../utils/eventEmmiter.js";
// import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import wsService from "../services/WebSocketService.js";
import { generateLevel } from "../utils/generationPlatform.js";
import { generateCigarettes } from "../utils/generationCigarette.js";

export default class GameScene extends Scene {
  constructor() {
    super({ key: "GameScene" });
    this.isGameOver = false;
    this.level = 1;
    this.score = 0;
    this.activeDrones = [];
    this.maxDrones = 4;
    this.lastDamageTime = 0;
    this.damageCooldown = 1000;
  }

  preload() {
    this.load.spritesheet("hearts", "./assets/heart.png", {
      frameWidth: 17,
      frameHeight: 17,
    });
    this.load.image("nightCityBg", "./assets/night-city-bg.png");
    this.load.image("nightCity", "./assets/night-city.png");
    this.load.image("clouds", "assets/night-city-cloud.png");
    this.load.image("platform", "./assets/night-platform.png");
    this.load.image("ground", "./assets/night-ground-platform.png");
    this.load.spritesheet("drone", "./assets/drone.png", {
      frameWidth: 55,
      frameHeight: 48,
    });
    this.load.image("cigarette", "./assets/cigarette.png");
    this.load.spritesheet("dude", "./assets/dude.png", {
      frameWidth: 51,
      frameHeight: 94,
      spacing: 5,
    });

    if (this.sys.game.device.os.desktop) {
      GameManager.updateIsDesktop(true);
    } else {
      GameManager.updateIsDesktop(false);
    }

    // if (!GameManager.getIsDesktop()) {
    //   this.load.plugin("rexvirtualjoystickplugin", VirtualJoystickPlugin, true);
    // }
  }

  updateScore(score) {
    this.score = score;
    this.scroreLabel.updateLabel(score);
    wsService.send({ action: "update_score" });
  }

  collectCigarette(player, cigarette) {
    this.tweens.killTweensOf(cigarette.glowCircle);
    cigarette.glowCircle.destroy();
    cigarette.destroy();

    this.updateScore(this.score + 10);
    if (this.cigarettes.countActive(true) === 0) {
      this.level += 1;
      this.regenerateLevel();
    }
  }

  deleteDrones() {
    this.activeDrones.forEach((item) => {
      item.destroy();
    });
    this.activeDrones = [];
  }

  spawnDrone() {
    const platforms = this.platforms.getChildren();
    const availablePlatforms = platforms.filter((p) => !p.hasDrone);

    if (availablePlatforms.length === 0) {
      console.warn("Нет свободных платформ для спавна дронов");
      return;
    }

    if (this.activeDrones.length >= this.maxDrones) {
      const oldDrone = this.activeDrones.shift();

      oldDrone.platform.hasDrone = false;
      oldDrone.destroy();
    }

    const platform = Phaser.Utils.Array.GetRandom(availablePlatforms);

    const drone = new Drone(this, platform);
    this.drones.add(drone);
    drone.body.setAllowGravity(false);
    drone.setImmovable(true);

    drone.platform = platform;
    platform.hasDrone = true;

    this.activeDrones.push(drone);
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

  hitDrone(player, drone) {
    player.setTint(0xff0000);
    const pushDirection = new Phaser.Math.Vector2(
      player.x - drone.x,
      player.y - drone.y
    );

    pushDirection.normalize();

    const pushStrength = 500;
    player.body.setVelocity(
      pushDirection.x * pushStrength,
      pushDirection.y * pushStrength
    );

    this.takeDamage(1);
    this.time.delayedCall(200, () => {
      player.clearTint();
    });
  }

  regenerateLevel() {
    this.physics.pause();
    this.platforms.clear(true, true);
    this.deleteDrones();
    let blinkDuration = 1000;

    this.children.each((child) => {
      if (child.setAlpha) {
        child.alpha = 1;
        this.tweens.add({
          targets: child,
          alpha: 0,
          duration: blinkDuration,
          yoyo: true,
          repeat: -1,
          delay: 0,
        });
      }
    });

    this.time.delayedCall(2000, () => {
      this.children.each((child) => {
        if (child.setAlpha) {
          this.tweens.killTweensOf(child);
          child.alpha = 1;
        }
      });

      this.physics.resume();
    });

    generateLevel({ scene: this });
    generateCigarettes(this);
    for (
      let i = 0;
      i < (this.level + 1 > this.maxDrones ? this.maxDrones : this.level + 1);
      i++
    ) {
      this.spawnDrone();
    }
  }

  takeDamage(amount) {
    const currentTime = this.time.now;

    if (currentTime - this.lastDamageTime < this.damageCooldown) {
      return;
    }

    this.lastDamageTime = currentTime;

    this.health = Math.max(this.health - amount * 2, 0);
    this.updateHearts();

    if (this.health === 0) {
      this.player.anims.play("turn");
      this.isGameOver = true;
      this.gameOver();
    }
  }

  updateHearts() {
    for (let i = 0; i < this.maxHearts; i++) {
      let heartIndex = i * 2;
      if (this.health > heartIndex + 1) {
        this.hearts[i].setFrame(0); // Полное сердце
      } else if (this.health === heartIndex + 1) {
        this.hearts[i].setFrame(1); // Половина сердца
      } else {
        this.hearts[i].setFrame(2); // Пустое сердце
      }
    }
  }

  create() {
    wsService.connect();
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const scale = (gameHeight - 25) / 10 / 55; // groundHeight countGameRows platformHeight

    const nightCityBG = this.add.image(0, 0, "nightCityBg").setOrigin(0, 0);
    nightCityBG.displayWidth = gameWidth;
    nightCityBG.displayHeight = gameHeight;

    this.clouds = this.add
      .tileSprite(0, 0, gameWidth, 85, "clouds")
      .setOrigin(0, 0);
    this.clouds.displayHeight = (gameHeight / 10) * 4;
    this.clouds.displayWidth = gameWidth * 3;

    const nightCity = this.add.image(0, 0, "nightCity").setOrigin(0, 0);
    nightCity.displayWidth = gameWidth;
    nightCity.displayHeight = gameHeight;

    this.player = new Player(this, 100, 450, scale);
    const ground = this.physics.add.staticImage(
      gameWidth / 2,
      gameHeight - 12,
      "ground"
    );
    ground.displayWidth = gameWidth;
    ground.refreshBody();

    this.platforms = this.physics.add.staticGroup();

    generateLevel({ scene: this });

    this.cigarettes = this.physics.add.group();
    generateCigarettes(this);

    this.scroreLabel = new ScoreLabel(this, 16, 16, 0, {
      fontFamily: "PixelCyr",
      fontSize: "32px",
      fill: "#000",
    });

    // if (!GameManager.getIsDesktop()) {
    //   this.joystick1 = this.plugins.get("rexvirtualjoystickplugin").add(this, {
    //     x: this.scale.width - 110,
    //     y: this.scale.height - 110,
    //     radius: 80,
    //     base: this.add.circle(0, 0, 80, 0x888888),
    //     thumb: this.add.circle(0, 0, 40, 0xffffff),
    //     dir: 2,
    //   });
    // }

    this.maxHearts = 3;
    this.health = this.maxHearts * 2;
    this.heartSize = 34;

    this.hearts = [];

    for (let i = 0; i < this.maxHearts; i++) {
      let heart = this.add.image(
        gameWidth - 120 + i * (this.heartSize + 5),
        32,
        "hearts"
      );
      heart.setDisplaySize(this.heartSize, this.heartSize);
      this.hearts.push(heart);
    }

    this.updateHearts();

    this.anims.create({
      key: "droneRedBlink",
      frames: [{ key: "drone", frame: 0 }],
      frameRate: 2,
    });

    this.anims.create({
      key: "droneBlueBlink",
      frames: [{ key: "drone", frame: 1 }],
      frameRate: 2,
    });

    this.drones = this.physics.add.group();

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.drones, ground);
    this.physics.add.overlap(
      this.player,
      this.drones,
      this.hitDrone,
      null,
      this
    );

    this.physics.add.collider(this.cigarettes, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.cigarettes,
      this.collectCigarette,
      null,
      this
    );

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.drones, this.platforms);
    this.physics.add.collider(
      this.player,
      this.drones,
      this.hitDrone,
      null,
      this
    );

    this.spawnDrone();
  }

  update(time, delta) {
    if (this.isGameOver) {
      return;
    }
    this.player.update();
    this.clouds.tilePositionX += 0.1;
    this.drones.getChildren().forEach((drone) => drone.update(time, delta));
  }
}
