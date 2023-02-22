import { render } from '../render.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';

export default class BoardPresenter {
  #boardComponent = null;
  #boardContainer = null;
  #filmsContainer = null;
  #showMoreButtonContainer = null;
  #filmsModel = null;
  #boardFilms = [];

  constructor ({boardComponent, boardContainer, filmsContainer, showMoreButtonContainer, filmsModel}) {
    this.#boardComponent = boardComponent;
    this.#boardContainer = boardContainer;
    this.#filmsContainer = filmsContainer;
    this.#showMoreButtonContainer = showMoreButtonContainer;
    this.#filmsModel = filmsModel;
  }

  init() {
    this.#boardFilms = [...this.#filmsModel.films];

    render(this.#boardComponent, this.#boardContainer);
    for (let i = 0; i < this.#boardFilms.length; i++) {
      render(new FilmCardView({film: this.#boardFilms[i]}), this.#filmsContainer);
    }

    render(new ShowMoreButtonView(), this.#showMoreButtonContainer);
    render(new TopRatedView(), this.#boardComponent.element);
    render(new MostCommentedView(), this.#boardComponent.element);
  }
}
