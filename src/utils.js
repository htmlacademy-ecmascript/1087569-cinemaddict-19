import dayjs from 'dayjs';
import { FilterType } from './consts';

const DATE_YEAR_FORMAT = 'YYYY';
const DATE_RELEASE_FORMAT = 'D MMMM YYYY';
const DATE_COMMENT_FORMAT = 'YYYY/MM/D H:mm';

const SHAKE_ANIMATION_TIMEOUT = 600;

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayElement = (arr) => arr[getRandomNumber(0, arr.length - 1)];

const formatYearFilm = (dateFilm) => dateFilm ? dayjs(dateFilm).format(DATE_YEAR_FORMAT) : '';
const formatReleaseFilm = (dateFilm) => dateFilm ? dayjs(dateFilm).format(DATE_RELEASE_FORMAT) : '';
const formatCommentDate = (dateComment) => dateComment ? dayjs(dateComment).format(DATE_COMMENT_FORMAT) : '';

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

const fixPopupScroll = (popup, coordY) => popup.scrollTo(0, coordY);

const shakeForElement = (element, callback) => {
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
    callback?.();
  }, SHAKE_ANIMATION_TIMEOUT);
};

export { getRandomArrayElement, getRandomNumber, formatYearFilm, formatDuration, formatReleaseFilm, formatCommentDate, sortDateDown, sortRatingDown, fixPopupScroll, filter, shakeForElement };
