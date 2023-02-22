import { render } from '../render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import { Keys } from '../consts.js';

export default class BoardPresenter {
  #boardComponent = null;
  #boardContainer = null;
  #filmsContainer = null;
  #showMoreButtonContainer = null;
  #filmsModel = null;
  #bodyContainer = null;
  #boardFilms = [];

  constructor ({boardComponent, boardContainer, filmsContainer, showMoreButtonContainer, filmsModel, bodyContainer}) {
    this.#boardComponent = boardComponent;
    this.#boardContainer = boardContainer;
    this.#filmsContainer = filmsContainer;
    this.#showMoreButtonContainer = showMoreButtonContainer;
    this.#filmsModel = filmsModel;
    this.#bodyContainer = bodyContainer;
  }

  init() {
    this.#boardFilms = [...this.#filmsModel.films];

    render(this.#boardComponent, this.#boardContainer);
    for (let i = 0; i < this.#boardFilms.length; i++) {
      this.#renderFilm(this.#boardFilms[i]);
    }

    render(new ShowMoreButtonView(), this.#showMoreButtonContainer);
    render(new TopRatedView(), this.#boardComponent.element);
    render(new MostCommentedView(), this.#boardComponent.element);
  }

  #renderFilm (film) {
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

    render(filmCardComponent, this.#filmsContainer);
  }
}
