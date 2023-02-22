import { createElement } from '../render.js';

const createFilmsCountTemplate = () => '<p>130 291 movies inside</p>';

export default class FilmsCountView {
  #element = null;

  get template() {
    return createFilmsCountTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
