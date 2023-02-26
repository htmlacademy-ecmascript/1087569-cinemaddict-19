import { createElement } from '../render.js';

const createFilmsCountTemplate = () => '<p>130 291 movies inside</p>';

export default class FilmsCountView {
  getTemplate() {
    return createFilmsCountTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
