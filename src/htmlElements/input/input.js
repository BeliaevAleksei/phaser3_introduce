import "./input.css";
import html from "./input.html?raw";

export default class PlayerInput {
  constructor(name, onSubmit) {
    this.name = /^[а-яА-Яa-zA-Z0-9]+$/.test(name) ? name : null;
    this.onSubmit = onSubmit;
    this.container = null;
  }

  async load() {
    document.getElementById("player_name_form_container")?.remove();

    this.container = document.createElement("div");
    this.container.innerHTML += html;

    document.body.appendChild(this.container);

    const form = this.container.querySelector("#player_name_form");
    const input = this.container.querySelector("#player_name_input");
    input.value = this.name || null;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const playerName = input.value.trim();

      if (!/^[а-яА-Яa-zA-Z0-9]+$/.test(playerName)) {
        alert("Можно вводить только буквы и цифры!");
        return;
      }

      this.container.remove();
      this.onSubmit(playerName);
    });
  }
}
