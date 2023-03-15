import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../consts.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (`
    <a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">
      ${name} ${name !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ' '}
    </a>`
  );
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');
  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element
      .addEventListener('click', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.dataset.filterType);
  };
}
