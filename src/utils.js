import dayjs from 'dayjs';
import { FilterType, CardExtraType, UserRank } from './consts';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const DATE_YEAR_FORMAT = 'YYYY';
const DATE_RELEASE_FORMAT = 'D MMMM YYYY';

const SHAKE_ANIMATION_TIMEOUT = 600;
const MAX_DESCRIPTION_LENGTH = 139;

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayElement = (arr) => arr[getRandomNumber(0, arr.length - 1)];

const getTwoRandomFilms = (films) => {
  const randomFilms = [];
  const firstFilm = getRandomArrayElement(films);
  const index = films.findIndex(firstFilm);
  films.splice(index, 1);
  const secondFilm = getRandomArrayElement(films);
  randomFilms.push(firstFilm);
  randomFilms.push(secondFilm);
  return randomFilms;
};

const formatYearFilm = (dateFilm) => dateFilm ? dayjs(dateFilm).format(DATE_YEAR_FORMAT) : '';
const formatReleaseFilm = (dateFilm) => dateFilm ? dayjs(dateFilm).format(DATE_RELEASE_FORMAT) : '';
const formatCommentDate = (dateComment) => dateComment ? dayjs(dateComment).fromNow() : '';

const formatDuration = (duration) => {
  let hours = 0;
  let minutes = 0;
  if (duration % 60 > 0) {
    hours = Math.floor(duration / 60);
    minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.watchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.favorite)
};

const getWeightForNull = (dataA, dataB) => {
  if (dataA === null && dataB === null) {
    return 0;
  }

  if (dataA === null) {
    return 1;
  }

  if (dataB === null) {
    return -1;
  }

  return null;
};

const sortDateDown = (filmA, filmB) => {
  const weight = getWeightForNull(filmA.filmInfo.release.date, filmB.filmInfo.release.date);
  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

const sortRatingDown = (filmA, filmB) => {
  const weight = getWeightForNull(filmA.filmInfo.totalRating, filmB.filmInfo.totalRating);
  return weight ?? filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};

const sortCommentsCountDown = (filmA, filmB) => filmB.comments.length - filmA.comments.length;

const fixPopupScroll = (popup, coordY) => popup.scrollTo(0, coordY);

const shakeForElement = (element, callback) => {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
    callback?.();
  }, SHAKE_ANIMATION_TIMEOUT);
};

const generatePresenterId = (filmId, extraType) => {
  switch(extraType) {
    case CardExtraType.TOP_RATED:
      return `${filmId}-${CardExtraType.TOP_RATED}`;
    case CardExtraType.MOST_COMMENTED:
      return `${filmId}-${CardExtraType.MOST_COMMENTED}`;
    default:
      return filmId;
  }
};

const checkZeroRatings = (films) => {
  const checkedFilms = films.slice().filter((film) => film.filmInfo.totalRating === 0);
  return checkedFilms.length === films.length;
};

const checkZeroCountComments = (films) => {
  const checkedFilms = films.slice().filter((film) => film.comments.length === 0);
  return checkedFilms.length === films.length;
};

const checkEqualityRatings = (films) => {
  const firstFilm = films[0];
  const checkedFilms = films.slice().filter((film) => film.filmInfo.totalRating === firstFilm.filmInfo.totalRating);
  return checkedFilms.length === films.length;
};

const checkEqualityCountComments = (films) => {
  const firstFilm = films[0];
  const checkedFilms = films.slice().filter((film) => film.comments.length === firstFilm.comments.length);
  return checkedFilms.length === films.length;
};

const getUserRank = (filmsCount) => {
  if (filmsCount >= 1 && filmsCount <= 10) {
    return UserRank.NOVICE;
  }

  return filmsCount >= 11 && filmsCount <= 20 ? UserRank.FAN : UserRank.MOVIE_BUFF;
};

const getClippedDescription = (description) => `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;

export { getRandomArrayElement, getRandomNumber, formatYearFilm, formatDuration, formatReleaseFilm, formatCommentDate, sortDateDown, sortRatingDown, sortCommentsCountDown, fixPopupScroll, filter, shakeForElement, generatePresenterId, checkZeroRatings, checkZeroCountComments, checkEqualityRatings, checkEqualityCountComments, getTwoRandomFilms, getUserRank, getClippedDescription };
