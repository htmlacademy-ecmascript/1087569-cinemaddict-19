import dayjs from 'dayjs';

const DATE_YEAR_FORMAT = 'YYYY';
const DATE_RELEASE_FORMAT = 'D MMMM YYYY';
const DATE_COMMENT_FORMAT = 'YYYY/MM/D H:mm';

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

const getComments = (commentItems, commentIds) => commentItems.filter((item) => commentIds.includes(item.id));

export { getRandomArrayElement, getRandomNumber, formatYearFilm, formatDuration, formatReleaseFilm, getComments, formatCommentDate };
