import { getRandomArrayElement, getRandomNumber } from '../utils.js';
import { COMMENT_EMOTIONS } from '../consts.js';

const COMMENT_AUTHORS = ['Johnny Depp', 'Al Pacino', 'Robert De Niro', 'Kevin Spacey', 'Russell Crowe', 'Angelina Jolie'];
const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg'
];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
];

const commentItems = [
  {
    id: '1',
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: 'a film that changed my life!',
    date: '2019-05-11T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS)
  },
  {
    id: '2',
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    date: '2019-05-12T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS)
  },
  {
    id: '3',
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: 'It\'s amazing movie',
    date: '2019-05-13T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS)
  },
  {
    id: '4',
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: 'It\'s wonderful movie',
    date: '2019-05-14T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS)
  }
];

const film = {
  'id': '0',
  'comments': [
    '1', '2', '3'
  ],
  'filmInfo': {
    'title': 'A Little Pony Without The Carpet',
    'alternativeTitle': 'Laziness Who Sold Themselves',
    'totalRating': getRandomNumber(0, 10),
    'poster': `images/posters/${getRandomArrayElement(POSTERS)}`,
    'ageRating': 0,
    'director': 'Tom Ford',
    'writers': [
      'Takeshi Kitano',
      'Anne Wigton'
    ],
    'actors': [
      'Morgan Freeman',
      'Erich von Stroheim'
    ],
    'release': {
      'date': '2019-05-11T00:00:00.000Z',
      'releaseCountry': 'Finland'
    },
    'duration': 77,
    'genre': [
      'Comedy',
      'Drama'
    ],
    'description': getRandomArrayElement(DESCRIPTIONS)
  },
  'userDetails': {
    'watchlist': false,
    'alreadyWatched': true,
    'watchingDate': '2019-04-12T16:12:32.554Z',
    'favorite': false
  }
};

const getFilm = () => film;

export { commentItems, getFilm };
