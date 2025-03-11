import "./style.css";

import Phaser from "phaser";

import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

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
  scene: {
    preload: preload,
    create: create,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "./assets/sky.png");
}

function create() {
  this.add.image(400, 300, "sky");

  import("./scenes/GameScene").then((module) => {
    const GameScene = module.default;
    game.scene.add("GameScene", GameScene);
    game.scene.start("GameScene");
  });
}
