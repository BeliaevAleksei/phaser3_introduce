import "./style.css";

import Phaser from "phaser";

import BootScene from "./scenes/BootScene";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "phaser-game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // width: 1980,
    // height: 1024,
    // zoom: 2,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [BootScene],
};

const game = new Phaser.Game(config);
