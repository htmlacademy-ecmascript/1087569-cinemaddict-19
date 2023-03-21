import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { fixPopupScroll, deleteComment } from '../utils.js';
import { Keys, Mode, UserAction, UpdateType } from '../consts.js';

export default class FilmPresenter {
  #filmsListContainer = null;
  #commentsModel = null;
  #bodyContainer = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #film = null;
  #mode = Mode.DEFAULT;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({filmsListContainer, commentsModel, bodyContainer, onDataChange, onModeChange}) {
    this.#filmsListContainer = filmsListContainer;
    this.#commentsModel = commentsModel;
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

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#mode === Mode.EDITING) {
      const currYcoord = prevFilmPopupComponent.element.scrollTop;
      replace(this.#filmCardComponent, prevFilmCardComponent);
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      fixPopupScroll(this.#filmPopupComponent.element, currYcoord);
    }
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

  async #addPopup() {
    const comments = await this.#getComments();
    this.#bodyContainer.classList.add('hide-overflow');
    this.#filmPopupComponent = new FilmPopupView({
      film: this.#film,
      commentsForFilm: comments,
      onClick: this.#handlePopupClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onDeleteClick: this.#handleDeleteClick
    });

    this.#bodyContainer.append(this.#filmPopupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('keydown', this.#combinationKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  async #getComments() {
    await this.#commentsModel.init(this.#film.id);
    return this.#commentsModel.comments;
  }

  #removePopup() {
    this.#bodyContainer.removeChild(this.#filmPopupComponent.element);
    this.#bodyContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#combinationKeyDownHandler);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === Keys.ESCAPE || evt.key === Keys.ESC) {
      evt.preventDefault();
      this.#removePopup();
      this.#mode = Mode.DEFAULT;
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        this.#film
      );
    }
  };

  #handleCardClick = () => {
    this.#addPopup();
  };

  #handlePopupClick = () => {
    this.#removePopup();
    this.#mode = Mode.DEFAULT;
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#film
    );
  };

  #handleWatchlistClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            watchlist: !this.#film.userDetails.watchlist,
          }
        }
      );
    } else {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            watchlist: !this.#film.userDetails.watchlist,
          }
        }
      );
    }
  };

  #handleWatchedClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            alreadyWatched: !this.#film.userDetails.alreadyWatched
          }
        }
      );
    } else {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            alreadyWatched: !this.#film.userDetails.alreadyWatched
          }
        }
      );
    }
  };

  #handleFavoriteClick = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            favorite: !this.#film.userDetails.favorite
          }
        }
      );
    } else {
      this.#handleDataChange(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        {
          ...this.#film,
          userDetails: {
            ...this.#film.userDetails,
            favorite: !this.#film.userDetails.favorite
          }
        }
      );
    }
  };

  #handleDeleteClick = (commentId) => {
    this.#handleDataChange(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        ...this.#film,
        comments: deleteComment([...this.#film.comments], commentId),
        commentId: commentId
      }
    );
  };

  #combinationKeyDownHandler = (evt) => {
    if (evt.key === Keys.CTRL || evt.key === Keys.COMMAND) {
      document.addEventListener('keydown', this.#secondButtonKeyDownHandler);
    }
  };

  #secondButtonKeyDownHandler = (evt) => {
    const currentComment = this.#filmPopupComponent._state.localComment.comment;
    const currentEmotion = this.#filmPopupComponent._state.localComment.emotion;
    if (evt.key === Keys.ENTER && currentComment && currentEmotion) {
      const update = FilmPopupView.parseStateToUpdate(this.#filmPopupComponent._state);
      this.#handleDataChange(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        update
      );
      document.removeEventListener('keydown', this.#secondButtonKeyDownHandler);
    } else {
      document.removeEventListener('keydown', this.#secondButtonKeyDownHandler);
    }
  };
}
