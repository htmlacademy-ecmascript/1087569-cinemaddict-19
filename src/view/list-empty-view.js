import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../consts.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now'
};

const createListEmptyTemplate = (isEmpty, filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];
  return(
    isEmpty ? `<h2 class="films-list__title">${noFilmsTextValue}</h2>` : '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>'
  );
};

export default class ListEmptyView extends AbstractView {
  #isEmpty = false;
  #filterType = null;

  constructor({isEmpty, filterType}) {
    super();
    this.#isEmpty = isEmpty;
    this.#filterType = filterType;
  }

  get template() {
    return createListEmptyTemplate(this.#isEmpty, this.#filterType);
  }
}
