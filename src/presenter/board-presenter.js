import { render, RenderPosition, remove } from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import { sortDateDown, sortRatingDown } from '../utils.js';
import { SortType } from '../consts.js';

const FILM_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = null;
  #showMoreButtonComponent = null;
  #filmsListContainer = null;
  #filmsModel = null;
  #bodyContainer = null;
  #mainContainer = null;
  #filmsListComponent = new FilmsListView();
  #sortComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor ({boardComponent, filmsListContainer, filmsModel, bodyContainer, mainContainer}) {
    this.#boardComponent = boardComponent;
    this.#filmsListContainer = filmsListContainer;
    this.#filmsModel = filmsModel;
    this.#bodyContainer = bodyContainer;
    this.#mainContainer = mainContainer;
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortDateDown);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortRatingDown);
    }

    return this.#filmsModel.films;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#mainContainer);

    if (this.films.length === 0) {
      this.#renderListEmpty(true);
    } else {
      this.#renderSort();
      this.#renderFilmsList();

      render(new TopRatedView(), this.#boardComponent.element);
      render(new MostCommentedView(), this.#boardComponent.element);
    }
  }

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new ShowMoreButtonView({
      onClick: this.#handleShowMoreButtonClick
    });

    render(this.#showMoreButtonComponent, this.#filmsListContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType : this.#currentSortType
    });

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.BEFOREBEGIN);
  }

  #renderListEmpty(isEmpty) {
    render(new ListEmptyView(isEmpty), this.#filmsListContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilmsList() {
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    render(this.#filmsListComponent, this.#filmsListContainer);
    this.#renderListEmpty();
    this.#renderFilms(films);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilms(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({
      filmsListContainer: this.#filmsListComponent.element,
      bodyContainer: this.#bodyContainer,
      onDataChange: this.#handleFilmChange,
      onModeChange: this.#handleModeChange
    });

    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  }

  #clearFilmsList() {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#filmPresenters.get(updatedFilm.id).init(updatedFilm);
  };

  #handleModeChange = () => {
    this.#filmPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsList();
    remove(this.#sortComponent);
    this.#renderSort();
    this.#renderFilmsList();
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
