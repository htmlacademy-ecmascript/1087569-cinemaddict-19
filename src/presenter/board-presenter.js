import { render } from '../render.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';

export default class BoardPresenter {

  constructor ({boardComponent, boardContainer, filmsContainer, showMoreButtonContainer}) {
    this.boardComponent = boardComponent;
    this.boardContainer = boardContainer;
    this.filmsContainer = filmsContainer;
    this.showMoreButtonContainer = showMoreButtonContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer);

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsContainer);
    }

    render(new ShowMoreButtonView(), this.showMoreButtonContainer);
    render(new TopRatedView(), this.boardComponent.getElement());
    render(new MostCommentedView(), this.boardComponent.getElement());
  }
}
