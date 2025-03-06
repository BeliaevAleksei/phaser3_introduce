import Phaser from "phaser";
import PlayerInput from "../htmlElements/input/input.js";
import wsService from "../services/WebSocketService.js";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
  }

  changeScene(event) {
    const data = JSON.parse(event.data);

    if (data.type === "save_success") {
      wsService.socket.removeEventListener("message", this.changeScene);
      this.scene.start("StatisticScene", {
        score: this.score,
        players: data.message,
      });
    }
  }

  create(data) {
    wsService.socket.addEventListener("message", this.changeScene.bind(this));
    this.input.keyboard.clearCaptures();
    this.score = data.score;
    this.add.image(400, 300, "sky");
    wsService.send({ action: "end_game" });
    const userName = localStorage.getItem("userName");

    const playerInput = new PlayerInput(userName, (playerName) => {
      wsService.send({ action: "save_result", username: playerName });
      localStorage.setItem("userName", playerName);
    });

    playerInput.load(userName);
  }

  update() {}
}
