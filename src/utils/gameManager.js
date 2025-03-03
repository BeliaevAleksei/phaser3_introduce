import EventEmitter from "../utils/eventEmmiter";

class GameManager {
  constructor() {
    if (!GameManager.instance) {
      this.isGameOver = false;
      this.shouldRestart = false;
      this.isDesktop = true;
      GameManager.instance = this;
    }

    return GameManager.instance;
  }

  updateGameOver(state) {
    this.isGameOver = state;
    EventEmitter.emit("onGameOverChange", this.isGameOver);
  }

  getGameOver() {
    return this.isGameOver;
  }

  updateShouldRestart(state) {
    this.shouldRestart = state;
    EventEmitter.emit("onShouldRestartChange", this.shouldRestart);
  }

  getShouldRestart() {
    return this.shouldRestart;
  }

  updateIsDesktop(state) {
    this.isDesktop = state;
    EventEmitter.emit("onIsDesktopChange", this.isDesktop);
  }

  getIsDesktop() {
    return this.isDesktop;
  }
}

export default new GameManager();
