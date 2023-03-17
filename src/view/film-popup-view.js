import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { formatDuration, formatReleaseFilm, formatCommentDate, getComments, fixPopupScroll } from '../utils.js';
import { COMMENT_EMOTIONS } from '../consts.js';
import { nanoid } from 'nanoid';

const createCommentsListTemplate = (comments) => (`
  <ul class="film-details__comments-list">${comments.map((comment) => (`
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
          <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
        </p>
      </div>
    </li>`)).join('')}
  </ul>`
);

const createNewCommentTemplate = (currentEmotion, currentComment) => (`
  <form class="film-details__new-comment" action="" method="get">
    <div class="film-details__add-emoji-label">
      ${currentEmotion ? `<img src="./images/emoji/${currentEmotion}.png" width="55" height="55" alt="emoji" data-emotion=${currentEmotion}>` : ''}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${currentComment ? currentComment : ''}</textarea>
    </label>

    <div class="film-details__emoji-list">${COMMENT_EMOTIONS.map((emotion) => `
      <input
        class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${emotion}"
        value="${emotion}"
        ${currentEmotion === emotion ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emotion}">
        <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji" data-emotion=${emotion}>
      </label>`).join('')}
    </div>
  </form>
`);

const createFilmPopupTemplate = (film) => {
  const {filmInfo, userDetails, localComment, commentsForFilm} = film;
  const commentsTemplate = createCommentsListTemplate(commentsForFilm);
  const newCommentTemplate = createNewCommentTemplate(localComment.emotion, localComment.comment);

  return(`
    <section class="film-details">
      <div class="film-details__inner">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.alternativeTitle}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatReleaseFilm(filmInfo.release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Duration</td>
                  <td class="film-details__cell">${formatDuration(filmInfo.duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${filmInfo.genre.map((genreItem) => `<span class="film-details__genre">${genreItem}</span>`).join('')}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button  film-details__control-button--watched ${userDetails.alreadyWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments${commentsForFilm.length > 0 ? `<span class="film-details__comments-count"> ${commentsForFilm.length}</span>` : ''}</h3>

            ${commentsTemplate}
            ${newCommentTemplate}

          </section>
        </div>
      </div>
    </section>`
  );
};

export default class FilmPopupView extends AbstractStatefulView {
  #handleClick = null;
  #handleWatchlistClick = null;
  #handleWatchedClick = null;
  #handleFavoriteClick = null;
  #handleDeleteClick = null;

  constructor({film, commentsModel, onClick, onWatchlistClick, onWatchedClick, onFavoriteClick, onDeleteClick}) {
    super();
    this._setState(FilmPopupView.parseFilmToState(film, commentsModel));
    this.#handleClick = onClick;
    this.#handleWatchlistClick = onWatchlistClick;
    this.#handleWatchedClick = onWatchedClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn')
      .addEventListener('click', this.#clickHandler);
    this.element.querySelector('#watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('#watched')
      .addEventListener('click', this.#watchedClickHandler);
    this.element.querySelector('#favorite')
      .addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comments-list')
      .addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('textarea')
      .addEventListener('input', this.#commentInputHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'IMG') {
      return;
    }
    const currYcoord = this.element.scrollTop;
    this.updateElement({
      localComment: {
        emotion: evt.target.dataset.emotion,
        comment: this._state.localComment.comment
      }
    });
    fixPopupScroll(this.element, currYcoord);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    this.#handleDeleteClick(evt.target.dataset.commentId);
  };

  #commentInputHandler = (evt) => {
    this._setState({
      localComment: {
        emotion: this._state.localComment.emotion,
        comment: evt.target.value
      }
    });
  };

  static parseFilmToState(film, commentsModel) {
    return {
      ...film,
      localComment: {
        comment: null,
        emotion: null
      },
      commentsForFilm: getComments(commentsModel.comments, film.comments)
    };
  }

  static parseStateToUpdate(state) {
    const newCommentId = nanoid();
    state.comments.push(newCommentId);
    const film = {
      ...state,
      localComment: {
        id: newCommentId,
        author: 'Movie Buff',
        comment: state.localComment.comment,
        date: '2022-05-11T00:00:00.000Z',
        emotion: state.localComment.emotion
      }
    };


    delete film.commentsForFilm;
    return film;
  }
}
