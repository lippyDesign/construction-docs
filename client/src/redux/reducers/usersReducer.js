import {
  FETCH_USERS_START,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_ERROR
} from '../actions';

const INITIAL_STATE = {
  error: '',
  loading: false,
  users: []
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USERS_START:
      return { ...state, error: '', users: [] };
    case FETCH_USERS_SUCCESS:
      return { ...state, error: '', users: action.payload };
    case FETCH_USERS_ERROR:
      return { ...state, error: action.payload, users: [] };
    default:
      return state;
  }
}