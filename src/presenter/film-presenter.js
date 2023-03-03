import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { Keys } from '../consts.js';

export default class FilmPresenter {
  #filmsListContainer = null;
  #bodyContainer = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #film = null;

  constructor({filmsListContainer, bodyContainer}) {
    this.#filmsListContainer = filmsListContainer;
    this.#bodyContainer = bodyContainer;
  }

  init(film) {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView({
      film: this.#film,
      onClick: this.#handleCardClick
    });
    this.#filmPopupComponent = new FilmPopupView({
      film: this.#film,
      onClick: this.#handlePopupClick
    });

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    if (this.#filmsListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#bodyContainer.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }

  #addPopup() {
    this.#bodyContainer.classList.add('hide-overflow');
    this.#bodyContainer.append(this.#filmPopupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #removePopup() {
    this.#bodyContainer.removeChild(this.#filmPopupComponent.element);
    this.#bodyContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #handleCardClick = () => {
    this.#addPopup();
  };

  #handlePopupClick = () => {
    this.#removePopup();
  };
}
