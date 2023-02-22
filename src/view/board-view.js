import { createElement } from '../render.js';

const createBoardTemplate = () => (`
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">

      </div>
    </section>
  </section>`
);

export default class BoardView {
  #element = null;

  get template() {
    return createBoardTemplate();
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
