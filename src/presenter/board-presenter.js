import { render, RenderPosition, remove } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import { Keys } from '../consts.js';

const FILM_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = null;
  #showMoreButtonComponent = null;
  #filmsListContainer = null;
  #filmsModel = null;
  #bodyContainer = null;
  #mainContainer = null;
  #filmsListComponent = new FilmsListView();
  #boardFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor ({boardComponent, filmsListContainer, filmsModel, bodyContainer, mainContainer}) {
    this.#boardComponent = boardComponent;
    this.#filmsListContainer = filmsListContainer;
    this.#filmsModel = filmsModel;
    this.#bodyContainer = bodyContainer;
    this.#mainContainer = mainContainer;
  }

  init() {
    this.#boardFilms = [...this.#filmsModel.films];
    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#mainContainer);

    if (this.#boardFilms.length === 0) {
      this.#renderListEmpty(true);
    } else {
      this.#renderSort();
      this.#renderFilmsList();

      render(new TopRatedView(), this.#boardComponent.element);
      render(new MostCommentedView(), this.#boardComponent.element);
    }
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#boardFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderShowMoreButton() {
    this.#showMoreButtonComponent = new ShowMoreButtonView({
      onClick: this.#handleShowMoreButtonClick
    });

    render(this.#showMoreButtonComponent, this.#filmsListContainer);
  }

  #renderSort() {
    render(new SortView(), this.#boardComponent.element, RenderPosition.BEFOREBEGIN);
  }

  #renderListEmpty(isEmpty) {
    render(new ListEmptyView(isEmpty), this.#filmsListContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilmsList() {
    render(this.#filmsListComponent, this.#filmsListContainer);
    this.#renderListEmpty();
    this.#renderFilms(0, Math.min(this.#boardFilms.length, FILM_COUNT_PER_STEP));

    if (this.#boardFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilms(from, to) {
    this.#boardFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #renderFilm(film) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
        evt.preventDefault();
        replacePopupToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const filmCardComponent = new FilmCardView({
      film,
      onClick: () => {
        replaceCardToPopup.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const filmPopupComponent = new FilmPopupView({
      film,
      onClick: () => {
        replacePopupToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToPopup() {
      this.#bodyContainer.classList.add('hide-overflow');
      this.#bodyContainer.append(filmPopupComponent.element);
    }

    function replacePopupToCard() {
      this.#bodyContainer.removeChild(filmPopupComponent.element);
      this.#bodyContainer.classList.remove('hide-overflow');
    }

    render(filmCardComponent, this.#filmsListComponent.element);
  }
}
