import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor({filmsApiService}) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments() {
    return this.#comments;
  }

  async init(movieId) {
    try {
      this.#comments = await this.#filmsApiService.getComments(movieId);
    } catch(err) {
      this.#comments = [];
    }
  }

  async addComment(updateType, update) {
    try {
      const newComment = await this.#filmsApiService.addComment(update.localComment, update.id);
      this.#comments = [newComment, ...this.#comments];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  async deleteComment(updateType, update) {
    const index = this.#comments.findIndex((comment) => comment.id === update.commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      await this.#filmsApiService.deleteComment(update.commentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
