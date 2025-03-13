import { Physics, Input } from "phaser";
import GameManager from "../utils/gameManager.js";

const SPEED = 160;
const JUMP = -520;

export default class Player extends Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "dude");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.isJumping = false;
    // this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(160, 1000);
    this.setGravityY(400);

    scene.anims.create({
      key: "left",
      frames: scene.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
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
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.W);
    this.aKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A);
    this.dKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D);
  }

  update() {
    if (this.cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-520);
    }

    if (GameManager.getIsDesktop()) {
      if (this.cursors.left.isDown || this.aKey.isDown) {
        this.setVelocityX(-SPEED);

        this.anims.play("left", true);
      } else if (this.cursors.right.isDown || this.dKey.isDown) {
        this.setVelocityX(SPEED);

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
        this.setVelocityY(JUMP);
      }
    } else {
      const joystickForceX = this.scene.joystick1.forceX;
      let velocityX = joystickForceX * SPEED;
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
        this.setVelocityY(JUMP);
        this.isJumping = true;
      }

      if (this.body.touching.down) {
        this.isJumping = false;
      }
    }
  }
}
