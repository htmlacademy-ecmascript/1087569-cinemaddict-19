import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../consts.js';

const createSortItemTemplate = (sortItem, isChecked) => (
  `<li><a href="#" class="sort__button ${isChecked ? 'sort__button--active' : ''}" data-sort-type="${sortItem}">Sort by ${sortItem}</a></li>`
);

const createSortTemplate = (currentSortType) => {
  const sortItemsTemplate = Object.entries(SortType).map((item) => item[1])
    .map((sortItem) => createSortItemTemplate(sortItem, currentSortType === sortItem))
    .join('');
  return(
    `<ul class="sort">
      ${sortItemsTemplate}
    </ul>`
  );
};

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({onSortTypeChange, currentSortType}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
