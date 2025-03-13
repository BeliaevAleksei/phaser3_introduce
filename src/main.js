import "./style.css";

import Phaser from "phaser";

import BootScene from "./scenes/BootScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
    zoom: 2,
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
