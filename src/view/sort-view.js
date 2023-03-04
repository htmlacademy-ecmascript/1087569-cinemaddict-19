import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../consts.js';

const createSortTemplate = () => (`
  <ul class="sort">
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button data-sort-type="${SortType.RATING}" sort__button--active">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }
}
