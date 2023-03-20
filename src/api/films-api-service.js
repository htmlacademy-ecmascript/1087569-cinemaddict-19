import ApiService from '../framework/api-service.js';
import { Method } from '../consts.js';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  async updateFilm(movie) {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(film) {
    const adaptedFilm = {
      ...film,
      'film_info': {
        ...film.filmInfo,
        'age_rating': film.filmInfo.ageRating,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        'release': {
          ...film.filmInfo.release,
          'release_country': film.filmInfo.release.releaseCountry
        }
      },
      'user_details': {
        ...film.userDetails,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.filmInfo.ageRating;
    delete adaptedFilm.filmInfo.alternativeTitle;
    delete adaptedFilm.filmInfo.totalRating;
    delete adaptedFilm.filmInfo.release.releaseCountry;
    delete adaptedFilm.userDetails.alreadyWatched;
    delete adaptedFilm.userDetails.watchingDate;

    return adaptedFilm;
  }
}
