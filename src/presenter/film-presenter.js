import { render, remove, replace } from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { fixPopupScroll, shakeForElement } from '../utils.js';
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

  async init(film) {
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
      await this.#createPopupComponent();
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      const currYcoord = this.#filmPopupComponent.element.scrollTop;
      this.#filmPopupComponent.updateElement({
        isSaving: true
      });
      fixPopupScroll(this.#filmPopupComponent.element, currYcoord);
    }
  }

  setDeleting(commentId) {
    if (this.#mode === Mode.EDITING) {
      const currYcoord = this.#filmPopupComponent.element.scrollTop;
      this.#filmPopupComponent.updateElement({
        isDeleting: true,
        deletingCommentId: commentId
      });
      fixPopupScroll(this.#filmPopupComponent.element, currYcoord);
    }
  }

  setAborting(actionType, commentId) {
    if (this.#mode === Mode.DEFAULT) {
      this.#filmCardComponent.shake();
      return;
    }

    const resetFormState = () => {
      const currYcoord = this.#filmPopupComponent.element.scrollTop;
      this.#filmPopupComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        deletingCommentId: null
      });
      fixPopupScroll(this.#filmPopupComponent.element, currYcoord);
    };

    switch(actionType) {
      case UserAction.UPDATE_FILM:
        shakeForElement(this.#filmPopupComponent.userControlsTemplate, resetFormState);
        break;
      case UserAction.ADD_COMMENT:
        shakeForElement(this.#filmPopupComponent.newCommentTemplate, resetFormState);
        break;
      case UserAction.DELETE_COMMENT:
        shakeForElement(this.#filmPopupComponent.getDeletingCommentTemplate(commentId), resetFormState);
        break;
    }
  }

  async #addPopup() {
    this.#bodyContainer.classList.add('hide-overflow');
    await this.#createPopupComponent();
    this.#bodyContainer.append(this.#filmPopupComponent.element);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.addEventListener('keydown', this.#combinationKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  async #getComments() {
    await this.#commentsModel.init(this.#film.id);
    return this.#commentsModel.comments;
  }

  async #createPopupComponent() {
    const comments = await this.#getComments();
    this.#filmPopupComponent = new FilmPopupView({
      film: this.#film,
      commentsForFilm: comments,
      onClick: this.#handlePopupClick,
      onWatchlistClick: this.#handleWatchlistClick,
      onWatchedClick: this.#handleWatchedClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onDeleteClick: this.#handleDeleteClick
    });
  }

  #removePopup() {
    this.#bodyContainer.removeChild(this.#filmPopupComponent.element);
    this.#bodyContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#combinationKeyDownHandler);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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
    this.#handleModeChange();
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
