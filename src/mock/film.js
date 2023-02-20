import { getRandomArrayElement } from '../utils.js';

const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const COMMENT_AUTHORS = ['Johnny Depp', 'Al Pacino', 'Robert De Niro', 'Kevin Spacey', 'Russell Crowe', 'Angelina Jolie'];
const POSTERS = [
  'made-for-each-other',
  'popeye-meets-sinbad',
  'sagebrush-trail',
  'santa-claus-conquers-the-martians',
  'the-dance-of-life',
  'the-great-flamarion',
  'the-man-with-the-golden-arm'
];

const comments = [
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
    date: '2019-05-11T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS)
  },
  {
    id: '3',
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: 'It\'s amazing movie',
    date: '2019-05-11T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS)
  },
  {
    id: '4',
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: 'It\'s wonderful movie',
    date: '2019-05-11T16:12:32.554Z',
    emotion: getRandomArrayElement(COMMENT_EMOTIONS)
  }
];

const film = {
  'id': '0',
  'comments': [
    '1', '2', '3'
  ],
  'film_info': {
    'title': 'A Little Pony Without The Carpet',
    'alternative_title': 'Laziness Who Sold Themselves',
    'total_rating': 5.3,
    'poster': `images/posters/${getRandomArrayElement(POSTERS)}.jpg`,
    'age_rating': 0,
    'director': 'Tom Ford',
    'writers': [
      'Takeshi Kitano'
    ],
    'actors': [
      'Morgan Freeman'
    ],
    'release': {
      'date': '2019-05-11T00:00:00.000Z',
      'release_country': 'Finland'
    },
    'duration': 77,
    'genre': [
      'Comedy'
    ],
    'description': 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
  },
  'user_details': {
    'watchlist': false,
    'already_watched': true,
    'watching_date': '2019-04-12T16:12:32.554Z',
    'favorite': false
  }
};

const getFilm = () => film;

export { comments, getFilm };
