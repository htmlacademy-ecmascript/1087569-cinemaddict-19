import Observable from '../framework/observable.js';
import { getFilm } from '../mock/film.js';

const FILM_COUNT = 13;

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = Array.from({length: FILM_COUNT}, getFilm);

  constructor({filmsApiService}) {
    super();
    this.#filmsApiService = filmsApiService;

    this.#filmsApiService.films.then((films) => {
      console.log(this.#adaptToClient(films[0]));
    });
  }

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

  #adaptToClient(film) {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film.film_info,
        ageRating: film['film_info']['age_rating'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        release: {
          ...film.film_info.release,
          releaseCountry: film['film_info']['release']['release_country']
        }
      },
      userDetails: {
        ...film.user_details,
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date']
      }
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['release']['release_country'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];

    return adaptedFilm;
  }
}
