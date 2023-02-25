import AbstractView from '../framework/view/abstract-view.js';

const createListEmptyTemplate = (isEmpty) => (
  isEmpty ? '<h2 class="films-list__title">There are no movies in our database</h2>' : '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>'
);

export default class ListEmptyView extends AbstractView {
  #isEmpty = false;

  constructor(isEmpty) {
    super();
    this.#isEmpty = isEmpty;
  }

  get template() {
    return createListEmptyTemplate(this.#isEmpty);
  }
}
