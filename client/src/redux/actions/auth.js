import axios from 'axios';

export const FETCH_USER_START = 'fetch_user_start';
export const FETCH_USER_SUCCESS = 'fetch_user_success';
export const FETCH_USER_ERROR = 'fetch_user_error';
export const fetchUser = () => async dispatch => {
  dispatch({ type: FETCH_USER_START });
  try {
    const res = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER_SUCCESS, payload: res.data });
  } catch(e) {
    dispatch({ type: FETCH_USER_ERROR, payload: 'there was a problem fetching profile' });
  }
};

export const UPDATE_USER_PROFILE_START = 'update_user_profile_start';
export const UPDATE_USER_PROFILE_SUCCESS = 'update_user_profile_success';
export const UPDATE_USER_PROFILE_ERROR = 'update_user_profile_error';
export const updateUserProfile = updatedUserInfo => async dispatch => {
  dispatch({ type: UPDATE_USER_PROFILE_START });
  try {
    const { data } = await axios.put('/api/update_user_profile', updatedUserInfo);
    dispatch({ type: UPDATE_USER_PROFILE_SUCCESS, payload: data });
  } catch(e) {
    dispatch({ type: UPDATE_USER_PROFILE_ERROR, payload: 'there was a problem updating user' });
  }
};

export const EMAIL_SIGNUP_USER_START = 'email_signup_user_start';
export const EMAIL_SIGNUP_USER_SUCCESS = 'email_signup_user_success';
export const EMAIL_SIGNUP_USER_ERROR = 'email_signup_user_error';
export const signUpWithEmailAndPassword = ({ email, password, confirmPassword }) => async dispatch => {
  dispatch({ type: EMAIL_SIGNUP_USER_START });
  try {
    if (password !== confirmPassword) {
      dispatch({ type: EMAIL_SIGNUP_USER_ERROR, payload: 'Passwords do not match' });
    } else {
      const { data } = await axios.post('/auth/signup', { email, password });
      dispatch({ type: EMAIL_SIGNUP_USER_SUCCESS, payload: data });
    }
  } catch(e) {
    dispatch({ type: EMAIL_SIGNUP_USER_ERROR, payload: 'Unable to sign up with those credentials' });
  }
};

export const EMAIL_LOGIN_USER_START = 'email_login_user_start';
export const EMAIL_LOGIN_USER_SUCCESS = 'email_login_user_success';
export const EMAIL_LOGIN_USER_ERROR = 'email_login_user_error';
export const loginWithEmailAndPassword = ({ email, password }) => async dispatch => {
  dispatch({ type: EMAIL_LOGIN_USER_START });
  try {
    const { data } = await axios.post('/auth/login', { email, password });
    dispatch({ type: EMAIL_LOGIN_USER_SUCCESS, payload: data });
  } catch(e) {
    dispatch({ type: EMAIL_LOGIN_USER_ERROR, payload: 'Unable to log in with those credentials' });
  }
};

export const LOGOUT_USER_START = 'logout_user_start';
export const LOGOUT_USER_SUCCESS = 'logout_user_success';
export const LOGOUT_USER_ERROR = 'logout_user_error';
export const logout = history => async dispatch => {
  dispatch({ type: LOGOUT_USER_START });
  try {
    await axios.get('/auth/logout');
    dispatch({ type: LOGOUT_USER_SUCCESS });
    history.push('/');
  } catch (e) {
    dispatch({ type: LOGOUT_USER_ERROR, payload: 'There was a problem logging out' });
  }
};