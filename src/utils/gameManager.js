import EventEmitter from "../utils/eventEmmiter";

class GameManager {
  constructor() {
    if (!GameManager.instance) {
      this.isGameOver = false;
      this.shouldRestart = false;
      this.score = 0;
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

  updateScore(score) {
    this.score = score;
    EventEmitter.emit("onScoreChange", this.score);
  }

  incrementScore(increment) {
    this.score += increment;
    EventEmitter.emit("onScoreChange", this.score);
  }

  getScore() {
    return this.score;
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
