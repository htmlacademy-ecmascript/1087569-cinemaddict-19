import { getFilm } from '../mock/film.js';

const FILM_COUNT = 5;

export default class FilmsModel {
  #films = Array.from({length: FILM_COUNT}, getFilm);

  get films() {
    return this.#films;
  }
}
