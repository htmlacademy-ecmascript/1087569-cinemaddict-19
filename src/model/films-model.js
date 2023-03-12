import Observable from '../framework/observable.js';
import { getFilm } from '../mock/film.js';

const FILM_COUNT = 13;

export default class FilmsModel extends Observable {
  #films = Array.from({length: FILM_COUNT}, getFilm);

  get films() {
    return this.#films;
  }

  updateFilm(updateType, update) {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
