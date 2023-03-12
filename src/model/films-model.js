import Observable from '../framework/observable.js';
import { getFilm } from '../mock/film.js';

const FILM_COUNT = 13;

export default class FilmsModel extends Observable {
  #films = Array.from({length: FILM_COUNT}, getFilm);

  get films() {
    return this.#films;
  }
}
