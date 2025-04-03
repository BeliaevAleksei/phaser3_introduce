import { Physics, Input } from "phaser";
import GameManager from "../utils/gameManager.js";

const SPEED = 160;
const JUMP = -480;

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y, scale) {
    super(scene, x, y, "dude");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.isJumping = false;
    this.jumpPower = JUMP * scale + JUMP * scale * (scene.level / 4);
    this.speedPower =
      SPEED * scale * scene.level + SPEED * scale * (scene.level / 4);
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(1600, 1000);
    this.setGravityY(1000);
    this.setScale(scale * 0.7);

    scene.anims.create({
      key: "left",
      frames: scene.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    scene.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    scene.anims.create({
      key: "right",
      frames: scene.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 5,
      repeat: -1,
    });

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.W);
    this.aKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A);
    this.dKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D);
  }

  update() {
    if (this.cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(this.jumpPower);
    }

    if (GameManager.getIsDesktop()) {
      if (this.cursors.left.isDown || this.aKey.isDown) {
        this.setVelocityX(-this.speedPower);

        this.anims.play("left", true);
      } else if (this.cursors.right.isDown || this.dKey.isDown) {
        this.setVelocityX(this.speedPower);

        this.anims.play("right", true);
      } else {
        this.setVelocityX(0);

        this.anims.play("turn");
      }

      if (
        (this.cursors.up.isDown ||
          this.wKey.isDown ||
          this.cursors.space.isDown) &&
        this.body.touching.down
      ) {
        this.setVelocityY(this.jumpPower);
      }
    } else {
      const joystickForceX = this.scene.joystick1.forceX;
      let velocityX = joystickForceX * this.speedPower;
      if (Math.abs(velocityX) < 10) {
        this.setVelocityX(0);
        this.anims.play("turn");
      } else {
        if (joystickForceX > 0) {
          this.anims.play("right", true);
        } else {
          this.anims.play("left", true);
        }
        this.setVelocityX(velocityX);
      }

      if (this.scene.joystick1.up && this.body.touching.down) {
        this.setVelocityY(this.jumpPower);
        this.isJumping = true;
      }

      if (this.body.touching.down) {
        this.isJumping = false;
      }
    }
  }
}
