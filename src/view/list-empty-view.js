import { createElement } from '../render.js';

const createListEmptyTemplate = (isEmpty) => (
  isEmpty ? '<h2 class="films-list__title">There are no movies in our database</h2>' : '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>'
);

export default class ListEmptyView {
  #element = null;
  #isEmpty = false;

  constructor(isEmpty) {
    this.#isEmpty = isEmpty;
  }

  get template() {
    return createListEmptyTemplate(this.#isEmpty);
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
