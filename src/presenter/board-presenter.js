import { render, RenderPosition } from '../framework/render.js';
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
  #boardContainer = null;
  #showMoreButtonComponent = null;
  #filmsListContainer = null;
  #filmsModel = null;
  #bodyContainer = null;
  #mainContainer = null;
  #filmsListComponent = new FilmsListView();
  #boardFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor ({boardComponent, boardContainer, filmsListContainer, filmsModel, bodyContainer, mainContainer}) {
    this.#boardComponent = boardComponent;
    this.#boardContainer = boardContainer;
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
    if (this.#boardFilms.length === 0) {
      render(this.#boardComponent, this.#boardContainer);
      render(new ListEmptyView(true), this.#filmsListContainer, RenderPosition.AFTERBEGIN);
    } else {
      render(new SortView(), this.#mainContainer);
      render(this.#boardComponent, this.#boardContainer);
      render(this.#filmsListComponent, this.#filmsListContainer);
      render(new ListEmptyView(), this.#filmsListContainer, RenderPosition.AFTERBEGIN);

      for (let i = 0; i < Math.min(this.#boardFilms.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#boardFilms[i]);
      }

      if (this.#boardFilms.length > FILM_COUNT_PER_STEP) {
        this.#showMoreButtonComponent = new ShowMoreButtonView();
        render(this.#showMoreButtonComponent, this.#filmsListContainer);
        this.#showMoreButtonComponent.element.addEventListener('click', this.#showMoreButtonClickHandler);
      }

      render(new TopRatedView(), this.#boardComponent.element);
      render(new MostCommentedView(), this.#boardComponent.element);
    }
  }

  #showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#boardFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#boardFilms.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #renderFilm(film) {
    const filmCardComponent = new FilmCardView({film});
    const filmPopupComponent = new FilmPopupView({film});

    const replaceCardToPopup = () => {
      this.#bodyContainer.classList.add('hide-overflow');
      this.#bodyContainer.append(filmPopupComponent.element);
    };

    const replacePopupToCard = () => {
      this.#bodyContainer.removeChild(filmPopupComponent.element);
      this.#bodyContainer.classList.remove('hide-overflow');
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
        evt.preventDefault();
        replacePopupToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    filmCardComponent.element.querySelector('a').addEventListener('click', () => {
      replaceCardToPopup();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      replacePopupToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(filmCardComponent, this.#filmsListComponent.element);
  }
}
