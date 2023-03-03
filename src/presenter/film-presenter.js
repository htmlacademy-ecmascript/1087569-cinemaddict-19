import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { Keys, Mode } from '../consts.js';

export default class FilmPresenter {
  #filmsListContainer = null;
  #bodyContainer = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #film = null;
  #mode = Mode.DEFAULT;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({filmsListContainer, bodyContainer, onDataChange, onModeChange}) {
    this.#filmsListContainer = filmsListContainer;
    this.#bodyContainer = bodyContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(film) {
    this.#film = film;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView({
      film: this.#film,
      onClick: this.#handleCardClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#filmPopupComponent = new FilmPopupView({
      film: this.#film,
      onClick: this.#handlePopupClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#removePopup();
    }
  }

  destroy() {
    remove(this.#filmCardComponent);
    remove(this.#filmPopupComponent);
  }

  #addPopup() {
    this.#bodyContainer.classList.add('hide-overflow');
    this.#bodyContainer.append(this.#filmPopupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #removePopup() {
    this.#bodyContainer.removeChild(this.#filmPopupComponent.element);
    this.#bodyContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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

  #handlePopupClick = (film) => {
    this.#handleDataChange(film);
    this.#removePopup();
  };

  #handleWatchlistClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {
        watchlist: !this.#film.userDetails.watchlist,
        alreadyWatched: this.#film.userDetails.alreadyWatched,
        watchingDate: this.#film.userDetails.watchingDate,
        favorite: this.#film.userDetails.favorite
      }
    });
  };

  #handleWatchedClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {
        watchlist: this.#film.userDetails.watchlist,
        alreadyWatched: !this.#film.userDetails.alreadyWatched,
        watchingDate: this.#film.userDetails.watchingDate,
        favorite: this.#film.userDetails.favorite
      }
    });
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#film,
      userDetails: {
        watchlist: this.#film.userDetails.watchlist,
        alreadyWatched: this.#film.userDetails.alreadyWatched,
        watchingDate: this.#film.userDetails.watchingDate,
        favorite: !this.#film.userDetails.favorite
      }
    });
  };
}
