import Car from "../objects/Car.js";
import { ThreeDSound } from "../utils/ThreeDSound.js";

export const MEGUMIN_SPAWN_STATE = Object.freeze({
  DRIVING_IN: "DRIVING_IN",
  STOPPED: "STOPPED",
  CHARACTER_EXIT: "CHARACTER_EXIT",
  CASTING: "CASTING",
  CHARACTER_ENTER: "CHARACTER_ENTER",
  DRIVING_OUT: "DRIVING_OUT",
  DONE: "DONE",
  INACTIVE: "INACTIVE",
});

export class MeguminSpawnController {
  constructor(scene) {
    this.scene = scene;
    this.state = MEGUMIN_SPAWN_STATE.INACTIVE;

    const gameWidth = scene.sys.game.config.width;
    const gameHeight = scene.sys.game.config.height;
    const groundHeight = 28;
    this.car = new Car(
      this.scene,
      -(gameWidth / 2),
      gameHeight - this.scene.scale * 0.7 * (103 / 2) - groundHeight
    );

    console.log("DDL 2", this);
    this.scene.physics.add.collider(this.car, this.scene.ground);
    this.carSound = new ThreeDSound(
      this.scene,
      "./assets/music/axel.mp3",
      this.car,
      gameWidth + 100,
      gameWidth / 5
    );
    this.carSound.initOnUserInput();
    this.doorSound = new ThreeDSound(
      this.scene,
      "./assets/music/door.mp3",
      this.car,
      gameWidth + 100,
      gameWidth / 5
    );
    this.doorSound.initOnUserInput();
    this.centerReached = false;
    this.car.setVisible(false);

    // this.character = scene.add.sprite(0, 0, 'character');
    // this.character.setVisible(false);

    // this.add(this.car);
    this.stateHandlers = {
      [MEGUMIN_SPAWN_STATE.DRIVING_IN]: this.handleDrivingIn.bind(this),
      [MEGUMIN_SPAWN_STATE.STOPPED]: this.handleStopped.bind(this),
      [MEGUMIN_SPAWN_STATE.CHARACTER_EXIT]: this.handleCharacterExit.bind(this),
      // [MEGUMIN_SPAWN_STATE.CASTING]: this.handleCasting.bind(this),
      // [MEGUMIN_SPAWN_STATE.CHARACTER_ENTER]:
      //   this.handleCharacterEnter.bind(this),
      // [MEGUMIN_SPAWN_STATE.DRIVING_OUT]: this.handleDrivingOut.bind(this),
      // [MEGUMIN_SPAWN_STATE.DONE]: this.handleDone.bind(this),
    };
  }

  update(time, delta) {
    if (this.state === MEGUMIN_SPAWN_STATE.DRIVING_IN) {
      this.car.update(time, delta);
      if (this.carSound) {
        this.carSound.update();
      }
    }
  }

  setState(newState) {
    this.state = newState;
    const handler = this.stateHandlers[newState];
    if (handler) {
      handler();
    } else {
      console.warn(`No handler for state: ${newState}`);
    }
  }

  handleDrivingIn() {
    console.log("DDL car", this);
    // this.car.setVisible(false);
    this.car.setVisible(true);
    this.car.move();
    this.carSound.play();

    this.scene.tweens.add({
      targets: this.car,
      x: this.scene.cameras.main.centerX,
      duration: 6000,
      onComplete: () => this.setState(MEGUMIN_SPAWN_STATE.STOPPED),
    });
  }

  handleStopped() {
    this.carSound.pause();
    this.car.stop();
    this.setState(MEGUMIN_SPAWN_STATE.CHARACTER_EXIT);
  }

  handleCharacterExit() {
    // const music = this.scene.sound.add("doorSound", {
    //   loop: false,
    //   volume: 1,
    // });
    console.log("DDL handleCharacterExit", this);
    this.doorSound.play();
    this.doorSound.update();
    // this.character.setVisible(true);

    // this.scene.time.delayedCall(1000, () => {
    //   this.setState("CASTING");
    // });
  }

  // handleCasting() {
  //   this.playAnimation(this.character, "cast");
  //   this.playSound("cast");

  //   this.scene.time.delayedCall(2000, () => {
  //     this.setState("CHARACTER_ENTER");
  //   });
  // }

  // handleCharacterEnter() {
  //   this.playAnimation(this.character, "enter");

  //   this.scene.time.delayedCall(1000, () => {
  //     this.character.setVisible(false);
  //     this.setState("DRIVING_OUT");
  //   });
  // }

  // handleDrivingOut() {
  //   this.playAnimation(this.car, "car_drive");
  //   this.playSound("drive");

  //   this.scene.tweens.add({
  //     targets: this,
  //     x: this.scene.cameras.main.width + 200,
  //     duration: 2000,
  //     onComplete: () => this.setState("DONE"),
  //   });
  // }

  // handleDone() {
  //   this.destroy(); // или можно скрыть, если нужно переиспользовать
  // }

  // === Вспомогательные методы ===

  // playAnimation(sprite, animKey) {
  //   if (sprite.anims) {
  //     sprite.play(animKey);
  //   }
  // }

  // playSound(soundKey) {
  //   this.scene.sound.play(soundKey);
  // }
}
