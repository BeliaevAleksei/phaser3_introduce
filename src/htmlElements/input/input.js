import "./input.css";
import html from "./input.html?raw";

export default class PlayerInput {
  constructor(name, onSubmit) {
    this.name =
      /^[а-яА-ЯA-Za-z0-9 _]*[а-яА-ЯA-Za-z0-9][а-яА-ЯA-Za-z0-9 _]*$/.test(name)
        ? name
        : null;
    this.onSubmit = onSubmit;
    this.container = null;
  }

  clearDefaultInputErrorMessage(e) {
    e.target.setCustomValidity("");
  }

  setupInputErrorMessage(e) {
    e.target.setCustomValidity(
      "Имя должно быть не длиннее 13 и без спецсиволов"
    );
  }

  async load() {
    document.getElementById("player_name_form_container")?.remove();

    this.container = document.createElement("div");
    this.container.innerHTML += html;

    document.body.appendChild(this.container);

    const form = this.container.querySelector("#player_name_form");
    const input = this.container.querySelector("#player_name_input");
    input.value = this.name || null;
    input.addEventListener("input", this.clearDefaultInputErrorMessage);
    input.addEventListener("invalid", this.setupInputErrorMessage);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const playerName = input.value.trim();

      if (
        !/^[а-яА-ЯA-Za-z0-9 _]*[а-яА-ЯA-Za-z0-9][а-яА-ЯA-Za-z0-9 _]*$/.test(
          playerName
        )
      ) {
        alert("Можно вводить только буквы и цифры!");
        return;
      }

      this.container.remove();
      this.onSubmit(playerName);
    });
  }
}
