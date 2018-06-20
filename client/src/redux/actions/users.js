import axios from 'axios';

export const FETCH_USERS_START = 'fetch_users_start';
export const FETCH_USERS_SUCCESS = 'fetch_users_success';
export const FETCH_USERS_ERROR = 'fetch_users_error';
export const fetchUsers = () => async dispatch => {
  dispatch({ type: FETCH_USERS_START });
  try {
    const res = await axios.get('/api/users');
    dispatch({ type: FETCH_USERS_SUCCESS, payload: res.data });
  } catch(e) {
    dispatch({ type: FETCH_USERS_ERROR, payload: 'there was a problem fetching profile' });
  }
};