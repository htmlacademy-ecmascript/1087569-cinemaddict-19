import AbstractView from '../framework/view/abstract-view.js';
import { getUserRank } from '../utils.js';

const createUserProfileTemplate = (filmsCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(filmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserProfileView extends AbstractView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createUserProfileTemplate(this.#filmsCount);
  }
}
