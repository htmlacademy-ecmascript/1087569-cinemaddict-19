import AbstractView from '../framework/view/abstract-view.js';

const createFilmsCountTemplate = () => '<p>130 291 movies inside</p>';

export default class FilmsCountView extends AbstractView {
  get template() {
    return createFilmsCountTemplate();
  }
}
