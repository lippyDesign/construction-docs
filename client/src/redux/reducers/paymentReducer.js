import {
  SAVE_PAYMENT_INFO_START,
  SAVE_PAYMENT_INFO_SUCCESS,
  SAVE_PAYMENT_INFO_ERROR
} from '../actions';

const INITIAL_STATE = {
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SAVE_PAYMENT_INFO_START:
      return { ...state, loading: true };
    case SAVE_PAYMENT_INFO_SUCCESS:
      return { ...state, loading: false };
    case SAVE_PAYMENT_INFO_ERROR:
      return { ...state, loading: false };
    default:
      return state;
  }
}