import {
  FETCH_USER_START,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  UPDATE_USER_PROFILE_START,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_ERROR,
  LOGOUT_USER_START,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_ERROR,
  EMAIL_SIGNUP_USER_START,
  EMAIL_SIGNUP_USER_SUCCESS,
  EMAIL_SIGNUP_USER_ERROR,
  EMAIL_LOGIN_USER_START,
  EMAIL_LOGIN_USER_SUCCESS,
  EMAIL_LOGIN_USER_ERROR
} from '../actions';

const INITIAL_STATE = {
  authInProgress: false,
  user: null,
  error: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER_START:
      return { ...state, user: null, error: '', authInProgress: true };
    case FETCH_USER_SUCCESS:
      return { ...state, user: action.payload, error: '', authInProgress: false };
    case FETCH_USER_ERROR:
      return { ...state, user: null, error: action.payload, authInProgress: false };
    case UPDATE_USER_PROFILE_START:
      return { ...state, user: null, error: '', authInProgress: true };
    case UPDATE_USER_PROFILE_SUCCESS:
      return { ...state, user: action.payload, error: '', authInProgress: false };
    case UPDATE_USER_PROFILE_ERROR:
      return { ...state, user: null, error: action.payload, authInProgress: false };
    case EMAIL_SIGNUP_USER_START:
      return { ...state, user: null, error: '', authInProgress: true };
    case EMAIL_SIGNUP_USER_SUCCESS:
      return { ...state, user: action.payload, error: '', authInProgress: false };
    case EMAIL_SIGNUP_USER_ERROR:
      return { ...state, user: null, error: action.payload, authInProgress: false };
    case EMAIL_LOGIN_USER_START:
      return { ...state, user: null, error: '', authInProgress: true };
    case EMAIL_LOGIN_USER_SUCCESS:
      return { ...state, user: action.payload, error: '', authInProgress: false };
    case EMAIL_LOGIN_USER_ERROR:
      return { ...state, user: null, error: action.payload, authInProgress: false };
    case LOGOUT_USER_START:
      return { ...state, authInProgress: true, error: '' };
    case LOGOUT_USER_SUCCESS:
      return { ...state, authInProgress: false, error: '', user: null };
    case LOGOUT_USER_ERROR:
      return { ...state, authInProgress: false, error: action.payload };
    default:
      return state;
  }
}