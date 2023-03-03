import AbstractView from '../framework/view/abstract-view.js';
import { formatYearFilm, formatDuration } from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {comments, filmInfo, userDetails} = film;
  return(`
    <article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${filmInfo.title}</h3>
        <p class="film-card__rating">${filmInfo.totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${formatYearFilm(filmInfo.release.date)}</span>
          <span class="film-card__duration">${formatDuration(filmInfo.duration)}</span>
          <span class="film-card__genre">${filmInfo.genre[0]}</span>
        </p>
        <img src="./${filmInfo.poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${filmInfo.description}</p>
          <span class="film-card__comments">${comments.length > 1 ? `${comments.length} comments` : `${comments.length} comment`}</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.alreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;
  #handleClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;

  constructor({film, onClick, onWatchlistClick, onWatchedClick, onFavoriteClick}) {
    super();
    this.#film = film;
    this.#handleClick = onClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('a')
      .addEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
