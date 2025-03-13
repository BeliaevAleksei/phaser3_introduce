import EventEmitter from "../utils/eventEmmiter";

class GameManager {
  constructor() {
    if (!GameManager.instance) {
      this.isDesktop = true;
      GameManager.instance = this;
    }

    return GameManager.instance;
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
