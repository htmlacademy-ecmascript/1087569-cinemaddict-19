import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../consts.js';

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;
  return (`
    <a href="#${name}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">
      ${name} ${name !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ' '}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');
  return (
    `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
