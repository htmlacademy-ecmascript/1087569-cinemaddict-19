const COMMENT_EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const Keys = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
  CTRL: 'Control',
  COMMAND: 'Command',
  ENTER: 'Enter'
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { COMMENT_EMOTIONS, Keys, FilterType, SortType, Mode, UserAction, UpdateType };
