import "./style.css";

import Phaser from "phaser";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";
import StatisticScene from "./scenes/StatisticScene";

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
  scene: [GameScene, GameOverScene, StatisticScene],
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: UIPlugin,
        mapping: "rexUI",
        sceneKey: "GameOverScene",
      },
    ],
  },
};

const game = new Phaser.Game(config);
