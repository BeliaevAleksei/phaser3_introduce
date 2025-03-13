import "./input.css";
import html from "./input.html?raw";

const defaultValidationErrorMessage =
  "Имя должно быть цензурным, не длиннее 13 символов, содержать только буквы, цифры и пробелы";

export default class PlayerInput {
  constructor(name, onSubmit) {
    this.name =
      /^[а-яА-ЯA-Za-z0-9 _]*[а-яА-ЯA-Za-z0-9][а-яА-ЯA-Za-z0-9 _]*$/.test(name)
        ? name
        : null;
    this.onSubmit = onSubmit;
    this.container = null;

    // this.clearInputError = this.clearDefaultInputErrorMessage.bind(this);
    this.setupValidationError = this.setupDefaultInputErrorMessage.bind(this);
    this.handleSubmit = this.onSubmitAction.bind(this);
  }

  // clearDefaultInputErrorMessage(event) {
  //   event.preventDefault();
  //   const input = this.container.querySelector("#player_name_input");
  //   if (input) {
  //     input.setCustomValidity("");
  //   }
  // }

  setupDefaultInputErrorMessage(event) {
    this.setupInputErrorMessage(defaultValidationErrorMessage);
  }

  setupInputErrorMessage(text) {
    const errorTextElement = this.container.querySelector(
      "#player_name_error_message"
    );
    if (errorTextElement) {
      errorTextElement.innerHTML = text;
      errorTextElement.style.visibility = "visible";
    }
  }

  destroy() {
    if (this.container) {
      const form = this.container.querySelector("#player_name_form");
      const input = this.container.querySelector("#player_name_input");

      if (input) {
        // input.removeEventListener("input", this.clearInputError);
        input.removeEventListener("invalid", this.setupValidationError);
      }

      if (form) {
        form.removeEventListener("submit", this.handleSubmit);
      }

      this.container.remove();
      this.container = null;
    }
  }

  onSubmitAction(event) {
    event.preventDefault();
    const input = this.container.querySelector("#player_name_input");
    input.setCustomValidity("");

    const playerName = input.value.trim();

    if (
      playerName.length < 3 ||
      playerName.length > 20 ||
      !/^[а-яА-ЯA-Za-z0-9 _]*[а-яА-ЯA-Za-z0-9][а-яА-ЯA-Za-z0-9 _]*$/.test(
        playerName
      )
    ) {
      this.setupInputErrorMessage(defaultValidationErrorMessage);
      return;
    }

    this.onSubmit(playerName);
  }

  async load() {
    document.getElementById("player_name_form_container")?.remove();

    this.container = document.createElement("div");
    this.container.innerHTML += html;

    document.body.appendChild(this.container);

    const form = this.container.querySelector("#player_name_form");
    const input = this.container.querySelector("#player_name_input");
    input.value = this.name || "";
    // input.addEventListener("input", this.clearInputError);
    input.addEventListener("invalid", this.setupValidationError);
    form.addEventListener("submit", this.handleSubmit);
  }
}
