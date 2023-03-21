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

  addComment(updateType, update) {
    this.#comments = [
      update,
      ...this.#comments
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
