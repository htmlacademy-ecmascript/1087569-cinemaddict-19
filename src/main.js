import { render } from './render.js';
import BoardView from './view/board-view.js';
import UserProfileView from './view/user-profile-view.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import FilmPopupView from './view/film-popup-view.js';
import FilmsCountView from './view/films-count-view.js';
import BoardPresenter from './presenter/board-presenter.js';


const boardComponent = new BoardView();
const mainContainer = document.querySelector('main');
const headerContainer = document.querySelector('header');
const filmsContainer = boardComponent.getElement().querySelector('.films-list__container');
const showMoreButtonContainer = boardComponent.getElement().querySelector('.films-list');
const filmsCountContainer = document.querySelector('.footer__statistics');
const bodyContainer = document.querySelector('body');
const boardPresenter = new BoardPresenter({
  boardComponent: boardComponent,
  boardContainer: mainContainer,
  filmsContainer: filmsContainer,
  showMoreButtonContainer: showMoreButtonContainer
});

render(new UserProfileView(), headerContainer);
render(new FilterView(), mainContainer);
render(new SortView(), mainContainer);
boardPresenter.init();
render(new FilmPopupView(), bodyContainer);
render(new FilmsCountView(), filmsCountContainer);

