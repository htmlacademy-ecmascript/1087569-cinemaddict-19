import { render, RenderPosition, remove } from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedView from '../view/top-rated-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import { sortDateDown, sortRatingDown, filter } from '../utils.js';
import { SortType, UserAction, UpdateType, FilterType } from '../consts.js';

const FILM_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #boardComponent = null;
  #showMoreButtonComponent = null;
  #filmsListContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filtersModel = null;
  #bodyContainer = null;
  #mainContainer = null;
  #filmsListComponent = new FilmsListView();
  #sortComponent = null;
  #listEmptyComponent = null;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor ({boardComponent, filmsListContainer, filmsModel, commentsModel, filtersModel, bodyContainer, mainContainer}) {
    this.#boardComponent = boardComponent;
    this.#filmsListContainer = filmsListContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filtersModel = filtersModel;
    this.#bodyContainer = bodyContainer;
    this.#mainContainer = mainContainer;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filtersModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortDateDown);
      case SortType.RATING:
        return filteredFilms.slice().sort(sortRatingDown);
    }

    return filteredFilms;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#mainContainer);

    if (this.#isLoading) {
      this.#renderListEmpty(false, this.#isLoading);
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderListEmpty(true);
    } else {
      this.#renderSort();
      render(this.#filmsListComponent, this.#filmsListContainer);
      this.#renderListEmpty(false, this.#isLoading);
      this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

      if (filmCount > this.#renderedFilmCount) {
        this.#renderShowMoreButton();
      }

      render(new TopRatedView(), this.#boardComponent.element);
      render(new MostCommentedView(), this.#boardComponent.element);
    }
  }

  #clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this.films.length;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#listEmptyComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
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

  #renderListEmpty(isEmpty, isLoading) {
    this.#listEmptyComponent = new ListEmptyView({
      isEmpty: isEmpty,
      isLoading: isLoading,
      filterType: this.#filterType
    });

    render(this.#listEmptyComponent, this.#filmsListContainer, RenderPosition.AFTERBEGIN);
  }

  #renderFilms(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({
      filmsListContainer: this.#filmsListComponent.element,
      commentsModel: this.#commentsModel,
      bodyContainer: this.#bodyContainer,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    const commentId = update.commentId;
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmPresenters.get(update.id).setSaving();
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#filmPresenters.get(update.id).setAborting(actionType);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPresenters.get(update.id).setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);
          delete update.localComment;
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#filmPresenters.get(update.id).setAborting(actionType);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPresenters.get(update.id).setDeleting(commentId);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
          delete update.commentId;
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#filmPresenters.get(update.id).setAborting(actionType, commentId);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#listEmptyComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#filmPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
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
