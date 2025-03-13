import { Scene } from "phaser";
import PlayerInput from "../htmlElements/input/input.js";
import wsService from "../services/WebSocketService.js";

export default class GameOverScene extends Scene {
  constructor() {
    super({ key: "GameOverScene" });
    this.playerInput = null;
    this.handleChangeScene = this.changeScene.bind(this);
  }

  preload() {
    this.load.image("sky", "./assets/sky.png");
  }

  changeScene(event) {
    const data = JSON.parse(event.data);

    if (data.type === "save_success") {
      wsService.socket.removeEventListener("message", this.handleChangeScene);
      this.playerInput.destroy();

      if (this.game.scene.getScene("StatisticScene")) {
        this.scene.start("StatisticScene", {
          score: this.score,
          players: data.message,
        });
        return;
      }

      import(`./StatisticScene.js`)
        .then((module) => {
          const SceneClass = module.default;
          this.scene.add("StatisticScene", SceneClass);
          this.scene.start("StatisticScene", {
            score: this.score,
            players: data.message,
          });
        })
        .catch((err) => {
          console.error("Ошибка загрузки сцены:", err);
        });
    }

    if (data.type === "invalid_name") {
      this.playerInput.setupDefaultInputErrorMessage();
    }
  }

  create(data) {
    wsService.socket.addEventListener("message", this.handleChangeScene);
    this.input.keyboard.clearCaptures();
    this.score = data.score;
    this.add.image(400, 300, "sky");
    wsService.send({ action: "end_game" });
    const userName = localStorage.getItem("userName");

    this.playerInput = new PlayerInput(userName, (playerName) => {
      wsService.send({ action: "save_result", username: playerName });
      localStorage.setItem("userName", playerName);
    });

    this.playerInput.load(userName);
  }

  update() {}
}
