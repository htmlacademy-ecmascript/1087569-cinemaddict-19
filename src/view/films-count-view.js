import AbstractView from '../framework/view/abstract-view.js';

const createFilmsCountTemplate = (filmsCount) => `<p>${filmsCount} movies inside</p>`;

export default class FilmsCountView extends AbstractView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFilmsCountTemplate(this.#filmsCount);
  }
}
